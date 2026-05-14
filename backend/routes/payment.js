const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/auth');

// @route   POST /api/payment/create-checkout-session
// @desc    Create Stripe checkout session for Pro plan
// @access  Private
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const { isAnnual } = req.body;
    
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your_stripe_secret_key_here') {
      return res.status(400).json({ 
        message: 'Stripe is not configured. Please add your STRIPE_SECRET_KEY to the backend .env file.' 
      });
    }

    const price = isAnnual ? 7900 : 9900; // $79 or $99 in cents

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'StreamHub Pro',
              description: isAnnual ? 'Annual Subscription' : 'Monthly Subscription',
            },
            unit_amount: price,
            recurring: {
              interval: isAnnual ? 'year' : 'month',
            }
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing?canceled=true`,
      customer_email: req.user.email,
      client_reference_id: req.user.id
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
});

// @route   POST /api/payment/mock-success
// @desc    Simulate successful payment by setting user to Premium locally
// @access  Private
router.post('/mock-success', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.isPremium = true;
    await user.save();
    
    res.json({ message: 'Subscription activated successfully!', isPremium: true });
  } catch (error) {
    console.error('Mock Payment Error:', error);
    res.status(500).json({ message: 'Could not process simulated payment.' });
  }
});

module.exports = router;
