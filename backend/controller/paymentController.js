const stripe = require('stripe')(process.env.STRIPE_SECRET);
const User = require('../model/user');
const priceId = process.env.STRIPE_PRICE_ID

const paymentController = {
    createSubscription: async (req, res) => {
        try {
            const { userId } = req.body;

            // Find the user in the database
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const customerId = user.stripeCustomerId;
            // console.log(customerId)

            if (!customerId) {
                return res.status(400).json({ message: 'No Stripe customer ID found for this user' });
            }

            // Create the subscription
            const subscription = await stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: priceId }],
                payment_behavior: 'default_incomplete',
                expand: ['latest_invoice.payment_intent'],
            });

            const clientSecret = subscription.latest_invoice.payment_intent.client_secret;

            user.role = 'client';
            await user.save();

            res.json({ clientSecret });
        } catch (error) {
            console.error("Backend Subscription Error:", error.message);
            res.status(400).json({ message: "Backend Subscription Error" });
        }
    }
};

module.exports = paymentController;
