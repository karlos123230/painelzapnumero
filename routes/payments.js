const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');

// Adicionar créditos
router.post('/add-credits', auth, async (req, res) => {
  try {
    const { amount } = req.body; // em centavos
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'brl',
      metadata: { userId: req.user._id.toString() }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao processar pagamento' });
  }
});

// Webhook do Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata.userId;
      const amount = paymentIntent.amount / 100;
      
      const user = await User.findById(userId);
      user.balance += amount;
      await user.save();
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ message: 'Erro no webhook' });
  }
});

module.exports = router;
