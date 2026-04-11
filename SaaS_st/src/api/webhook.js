const express = require('express');
const Stripe = require('stripe');
const { createClient } = require('@/lib/supabase/client');
const { format } = require('date-fns');

// Initialize services
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { 
  apiVersion: '2023-10-16', 
  rejectUnauthorized: true // Ensure secure SSL connections
});
const supabase = createClient();

const router = express.Router();

// Middleware to log requests with timestamps
const logRequest = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    console.log(`Webhook Received: ${req.method} ${req.url} | Status: ${res.statusCode} | Time: ${responseTime}ms`);
  });
  next();
};

// Validate event type
const isExpectedEvent = (eventType) => {
  const allowedEvents = ['checkout.session.completed', 'invoice.payment_succeeded'];
  return allowedEvents.includes(eventType);
};

router.post('/', logRequest, async (req, res) => {
  try {
    // Validate Stripe signature
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return res.status(401).send('Missing Stripe signature');
    }

    const event = await stripe.webhooks.constructEvent(
      JSON.stringify(req.body),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Validate event type before processing
    if (!isExpectedEvent(event.type)) {
      console.error(`Received unexpected event type: ${event.type}`);
      return res.status(400).send('Unsupported event type');
    }

    console.log(`Processing event: ${event.type} - ${event.data.object.id}`);

    // Process checkout.session.completed events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      await supabase.from('subscriptions').upsert({
        id: session.id,
        email: session.customer_email,
        status: 'active',
        created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        plan_id: session.line_items[0].price.id,
        payment_method: session.payment_method,
        canceled_at: null,
        metadata: {
          ip_address: req.ip,
          user_agent: req.headers['user-agent']
        }
      }).pluck('status', 'created_at').single();

      console.log(`Subscription updated: ${session.id}`);
    }

    res.setHeader('Content-Type', 'application/json');
    res.json({ event: 'success', timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss') });
    
  } catch (err) {
    // Enhanced error handling
    console.error(`Webhook Error: ${err.code || 'unknown_code'} ${err.message || 'No message'}`);
    res.status(500).json({
      error: 'Webhook processing failed',
      details: {
        originalError: err.message,
        stack: process.env.NODE_ENV === 'production' ? 'Hidden in production' : err.stack.slice(0, 1000),
        timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      }
    });
  }
});

module.exports = router;