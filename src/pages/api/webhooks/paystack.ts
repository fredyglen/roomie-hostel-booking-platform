import { PaymentService } from '@/services/payment-service';
import { logger } from '@/utils/enhanced-logger';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // Get the request body
    const payload = await req.json();

    // Validate the webhook signature
    const paystackSignature = req.headers.get('x-paystack-signature');
    if (!paystackSignature) {
      logger.warn('Missing Paystack signature header');
      return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Process the webhook
    const success = await PaymentService.handlePaymentWebhook(payload);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Failed to process webhook' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Return a success response
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    logger.error('Error processing Paystack webhook', { error });
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}