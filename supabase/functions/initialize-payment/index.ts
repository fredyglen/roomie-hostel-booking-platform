import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
// Using console-based logging within Edge Function; cannot import app-level utilities

import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!

// Define schema for incoming payment initialization request
const PaymentInitRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  amount: z.number().positive('Amount must be a positive number'),
  currency: z.string().optional().default('GHS'),
  metadata: z.record(z.unknown()).optional(),
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

    // Generate unique reference with business context (ensure uniqueness in DB)
    // Consider adding a check against existing references if collisions are a concern
    const reference = `ROOMI_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Set callback URL to our payment success page
    const callbackUrl = paymentData.callback_url ||
      `${supabaseUrl.replace('/supabase', '')}/payment-success`;

    console.log('Payment initialization requested:', JSON.stringify({ userId: user?.id, amount: paymentData.amount, currency: paymentData.currency }));

    // Prepare Paystack payload
    const paystackPayload = {
      email: paymentData.email,
      amount: Math.round(paymentData.amount * 100), // Convert to pesewas
      currency: paymentData.currency || 'GHS',
      reference,
      callback_url: callbackUrl,
      metadata: {
        ...paymentData.metadata,
        user_id: user.id,
        reference,
        platform: 'roomi',
        payment_type: 'booking'
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

    // Store transaction in database
    const { error: dbError } = await supabase.from('transactions').insert({
      reference,
      amount: paymentData.amount,
      currency: paymentData.currency || 'GHS',
      status: 'pending',
      customer_email: paymentData.email,
      customer_id: user.id,
      metadata: paymentData.metadata,
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
