import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { serverCommissionEngine } from '../_shared/commission-engine.ts'
// Using console-based logging within Edge Function; cannot import app-level utilities

import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!

// ✅ SECURITY: Block legacy payment API in production
// Set ALLOW_LEGACY_PAYMENTS=true in development/testing only
const ALLOW_LEGACY_PAYMENTS = Deno.env.get('ALLOW_LEGACY_PAYMENTS') === 'true';

// Define schema for incoming payment initialization request
// ✅ SUPPORTS BOTH NEW API (base_amount + has_agent) AND LEGACY API (amount)
const PaymentInitRequestSchema = z.object({
  email: z.string().email('Invalid email format'),

  // ✅ NEW API: Base amount (property rent) - preferred
  base_amount: z.number().positive('Base amount must be positive').optional(),

  // ✅ NEW API: Agent involvement flag
  has_agent: z.boolean().optional().default(false),

  // ⚠️ LEGACY API: Client-provided total (for backward compatibility)
  amount: z.number().positive('Amount must be a positive number').optional(),

  currency: z.string().optional().default('GHS'),

  // ✅ ENHANCED: Metadata with optional commission breakdown for validation
  metadata: z.object({
    booking_id: z.string().uuid().optional(),
    student_id: z.string().uuid().optional(),
    property_id: z.string().uuid().optional(),
    property_owner_id: z.string().uuid().optional(),
    agent_id: z.string().uuid().optional(),

    // ✅ NEW: Client-calculated commission breakdown (for validation)
    commission_breakdown: z.object({
      baseAmount: z.number().optional(),
      platformCommission: z.number().optional(),
      platformFixedFee: z.number().optional(),
      agentCommission: z.number().optional(),
      paystackFee: z.number().optional(),
      vatAmount: z.number().optional(),
      totalAmount: z.number().optional(),
    }).optional(),
  }).passthrough().optional(), // Allow additional metadata fields

  callback_url: z.string().url('Invalid callback URL format').optional(),
  channels: z.array(z.string()).optional(),
});

type PaymentInitRequest = z.infer<typeof PaymentInitRequestSchema>;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    })
  }

  try {
    // Validate critical environment variables early with clear logging
    const missingEnv: string[] = [];
    if (!supabaseUrl) missingEnv.push('SUPABASE_URL');
    if (!supabaseServiceKey) missingEnv.push('SUPABASE_SERVICE_ROLE_KEY');
    if (!paystackSecretKey) missingEnv.push('PAYSTACK_SECRET_KEY');
    if (missingEnv.length > 0) {
      console.error('Initialize Payment: Missing environment variables', { missingEnv });
      return new Response(
        JSON.stringify({ status: false, message: `Server misconfiguration: missing ${missingEnv.join(', ')}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: { Authorization: authHeader }
      }
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    // Validate incoming request body
    let paymentData: PaymentInitRequest;
    try {
      const body = await req.json();
      paymentData = PaymentInitRequestSchema.parse(body);
    } catch (error) {
      console.error('Payment data validation error:', error);
      return new Response(JSON.stringify({ status: false, message: 'Invalid request data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Basic authorization check: ensure the user has a profile (can be expanded)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('User profile not found or error fetching profile:', profileError);
      return new Response(JSON.stringify({ status: false, message: 'User profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Example authorization: only allow certain roles to initiate payments
    const allowedRoles = ['student', 'owner', 'admin']; // Define roles allowed to initiate payments
    if (!allowedRoles.includes(profile.role)) {
       console.error(`User ${user.id} with role ${profile.role} attempted to initiate payment.`);
       return new Response(JSON.stringify({ status: false, message: 'Unauthorized to initiate payment' }), {
         status: 403,
         headers: { ...corsHeaders, 'Content-Type': 'application/json' }
       });
    }

    // ============================================================================
    // ✅ STEP 1: LOAD COMMISSION RATES FROM DATABASE
    // ============================================================================
    try {
      await serverCommissionEngine.loadRates(supabase);
      console.log('✅ Commission rates loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load commission rates:', error);
      return new Response(JSON.stringify({
        status: false,
        message: 'Server configuration error: unable to load commission rates'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ============================================================================
    // ✅ STEP 2: DETERMINE BASE AMOUNT AND AGENT INVOLVEMENT
    // ============================================================================
    let baseAmount: number;
    let hasAgent: boolean;
    let isLegacyApi = false;

    if (paymentData.base_amount) {
      // ✅ NEW API: Use base_amount from client
      baseAmount = paymentData.base_amount;
      hasAgent = paymentData.has_agent || false;
      console.log('✅ Using new API: base_amount provided', {
        baseAmount,
        hasAgent,
        userId: user.id
      });
    } else if (paymentData.amount) {
      // ⚠️ LEGACY API: Client provided total amount
      isLegacyApi = true;

      // ✅ SECURITY: Block legacy API in production
      if (!ALLOW_LEGACY_PAYMENTS) {
        console.error('❌ Legacy payment API blocked in production', {
          userId: user.id,
          email: paymentData.email,
          amount: paymentData.amount
        });
        return new Response(JSON.stringify({
          status: false,
          message: 'Legacy payment API is deprecated. Please update your client to use base_amount + has_agent parameters.',
          error_code: 'LEGACY_API_BLOCKED'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      console.warn('⚠️  Using legacy API: amount provided without base_amount');
      console.warn('   This bypasses server-side commission validation!');
      console.warn('   User:', user.id, 'Email:', paymentData.email);
      console.warn('   Set ALLOW_LEGACY_PAYMENTS=false to block this in production');

      // For backward compatibility, treat amount as total and skip validation
      // This maintains existing booking flow while we migrate clients
      baseAmount = paymentData.amount;
      hasAgent = false; // Cannot determine agent involvement from legacy API
    } else {
      return new Response(JSON.stringify({
        status: false,
        message: 'Missing required field: base_amount or amount must be provided'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ============================================================================
    // ✅ STEP 3: CALCULATE SERVER-SIDE COMMISSIONS
    // ============================================================================
    let serverCommissions;
    let finalAmount: number;

    if (isLegacyApi) {
      // Legacy API: Use client-provided amount directly (no validation)
      finalAmount = baseAmount;
      console.log('⚠️  Legacy API: Using client amount without validation:', finalAmount);
    } else {
      // New API: Calculate server-side commissions
      try {
        serverCommissions = serverCommissionEngine.calculateCommissions(baseAmount, hasAgent);

        console.log('✅ Server-side commission calculation:', {
          baseAmount: serverCommissions.baseAmount,
          platformCommission: serverCommissions.platformCommission,
          platformFixedFee: serverCommissions.platformFixedFee,
          agentCommission: serverCommissions.agentCommission,
          paystackFee: serverCommissions.paystackFee,
          vatAmount: serverCommissions.vatAmount,
          totalAmount: serverCommissions.totalAmount,
          ownerReceives: serverCommissions.ownerReceives
        });

        finalAmount = serverCommissions.totalAmount;
      } catch (error) {
        console.error('❌ Commission calculation failed:', error);
        return new Response(JSON.stringify({
          status: false,
          message: error instanceof Error ? error.message : 'Failed to calculate commission breakdown'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // ============================================================================
      // ✅ STEP 4: VALIDATE CLIENT-PROVIDED COMMISSION BREAKDOWN (if present)
      // ============================================================================
      if (paymentData.metadata?.commission_breakdown) {
        const validation = serverCommissionEngine.validateCommissionBreakdown(
          serverCommissions,
          paymentData.metadata.commission_breakdown
        );

        if (!validation.valid) {
          console.error('❌ Commission validation FAILED:', validation.errors);

          // 🚨 SECURITY ALERT: Log detailed mismatch for audit
          console.error('🚨 SECURITY ALERT: Commission mismatch detected', {
            userId: user.id,
            userEmail: paymentData.email,
            userRole: profile.role,
            serverCalculated: serverCommissions,
            clientProvided: paymentData.metadata.commission_breakdown,
            errors: validation.errors,
            timestamp: new Date().toISOString()
          });

          return new Response(JSON.stringify({
            status: false,
            message: 'Commission validation failed. Please refresh the page and try again.',
            // Include errors in development for debugging (remove in production if needed)
            errors: validation.errors
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        console.log('✅ Commission validation PASSED');
      }
    }

    // Generate unique reference with business context (ensure uniqueness in DB)
    // Consider adding a check against existing references if collisions are a concern
    const reference = `ROOMI_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Set callback URL to our payment success page
    const callbackUrl = paymentData.callback_url ||
      `${supabaseUrl.replace('/supabase', '')}/payment-success`;

    console.log('Payment initialization requested:', JSON.stringify({
      userId: user?.id,
      baseAmount: isLegacyApi ? 'N/A (legacy)' : baseAmount,
      totalAmount: finalAmount,
      currency: paymentData.currency,
      hasAgent: isLegacyApi ? 'N/A (legacy)' : hasAgent,
      isLegacyApi,
      commissionVersion: serverCommissionEngine.getCurrentRates().version
    }));

    // ============================================================================
    // ✅ STEP 5: PREPARE PAYSTACK PAYLOAD WITH SERVER-CALCULATED AMOUNT
    // ============================================================================
    const paystackPayload = {
      email: paymentData.email,
      amount: Math.round(finalAmount * 100), // ✅ SERVER-CALCULATED OR LEGACY AMOUNT (in pesewas)
      currency: paymentData.currency || 'GHS',
      reference,
      callback_url: callbackUrl,
      metadata: {
        ...paymentData.metadata,
        user_id: user.id,
        reference,
        platform: 'roomi',
        payment_type: 'booking',

        // ✅ NEW: Store server-calculated commission snapshot (if not legacy)
        ...(serverCommissions && {
          commission_snapshot: {
            baseAmount: serverCommissions.baseAmount,
            platformCommission: serverCommissions.platformCommission,
            platformFixedFee: serverCommissions.platformFixedFee,
            agentCommission: serverCommissions.agentCommission,
            paystackFee: serverCommissions.paystackFee,
            vatAmount: serverCommissions.vatAmount,
            totalAmount: serverCommissions.totalAmount,
            ownerReceives: serverCommissions.ownerReceives,
            hasAgent,
            calculatedAt: new Date().toISOString(),
            rates: serverCommissionEngine.getCurrentRates()
          }
        }),

        // Mark legacy API usage for tracking
        isLegacyApi
      },
      channels: paymentData.channels || ['card', 'mobile_money', 'bank']
    };

    // Initialize transaction with Paystack
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(paystackPayload)
    });

    if (!paystackResponse.ok) {
      const text = await paystackResponse.text();
      console.error('Paystack HTTP error:', { status: paystackResponse.status, body: text });
      throw new Error(`Paystack HTTP ${paystackResponse.status}: ${text}`);
    }

    const paystackResult = await paystackResponse.json();

    if (!paystackResult?.status) {
      console.error('Paystack initialization failed (API status false):', paystackResult);
      throw new Error(paystackResult?.message || 'Payment initialization failed');
    }

    console.log(`Paystack initialization successful: ${paystackResult.data?.reference}`);

    // ============================================================================
    // ✅ STEP 6: STORE TRANSACTION WITH COMMISSION SNAPSHOT
    // ============================================================================
    const { error: dbError } = await supabase.from('transactions').insert({
      reference,
      amount: finalAmount, // ✅ SERVER-CALCULATED OR LEGACY AMOUNT
      currency: paymentData.currency || 'GHS',
      status: 'pending',
      customer_email: paymentData.email,
      customer_id: user.id,
      metadata: {
        ...paymentData.metadata,
        // ✅ Include commission snapshot for audit trail
        ...(serverCommissions && {
          commission_snapshot: paystackPayload.metadata.commission_snapshot
        }),
        isLegacyApi
      },
      paystack_reference: paystackResult.data?.reference,
      paystack_response: paystackResult,
      created_at: new Date().toISOString()
    });

    if (dbError) {
      console.warn('Transaction insert failed or table missing; continuing without persistence.', dbError);
    }

    return new Response(JSON.stringify({
      status: true,
      message: 'Payment initialized successfully',
      data: {
        reference,
        access_code: paystackResult.data.access_code,
        authorization_url: paystackResult.data.authorization_url
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    return new Response(JSON.stringify({
      status: false,
      message: error instanceof Error ? error.message : 'Payment initialization failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})
