const stripe = require('stripe')(process.env.STRIPE_SECRET);

const paymentController = {
    paymentIntent: async (req, res) => {
        try {
            const { amount, name, email } = req.body;
            // Create the payment intent 
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'php',
                automatic_payment_methods: {
                    enabled: true,
                },
                metadata: {
                },
                billing_details: {
                    name: name,
                    email: email,
                },
            });

            res.json({ paymentIntent: paymentIntent.client_secret });
        } catch (error) {
            console.error("Backend Payment Intent Error:", error.message);
            res.status(400).json({ message: "Backend Payment Intent Error" });
        }
    }
};

module.exports = paymentController;