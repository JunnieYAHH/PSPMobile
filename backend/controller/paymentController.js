const asyncHandler = require("express-async-handler");
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const User = require('../model/user');
const Transaction = require('../model/transaction');
const priceId = process.env.STRIPE_PRICE_ID
const berMonthsPromo = process.env.STRIPE_BERMONTHS_PROMO
const summerPromo = process.env.STRIPE_SUMMER_PROMO
const newYearsPromo = process.env.STRIPE_NEWYEAR_PROMO
const accesscard = process.env.STRIPE_ACCESSCARD

const paymentController = {
    stripeCreateSubscription: async (req, res) => {
        try {
            const { userId, promo } = req.body;
            // console.log(promo)

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

            const basePrice = await stripe.prices.retrieve(priceId);
            const accessCard = await stripe.prices.retrieve(accesscard);
            let items = [{ price: priceId }];

            if (promo === "") {
                const finalAmount = basePrice.unit_amount + accessCard.unit_amount;
                items = [{
                    price_data: {
                        currency: 'php',
                        product: basePrice.product,
                        unit_amount: finalAmount,
                        recurring: {
                            interval: 'year',
                        },
                    }
                }];
            } else if (promo === "December Promo") {
                const promoPrice = await stripe.prices.retrieve(berMonthsPromo);
                const finalAmount = basePrice.unit_amount - promoPrice.unit_amount + accessCard.unit_amount;
                items = [{
                    price_data: {
                        currency: 'php',
                        product: basePrice.product,
                        unit_amount: finalAmount,
                        recurring: {
                            interval: 'year',
                        },
                    }
                }];
            } else if (promo === "New Year's Promo") {
                const promoPrice = await stripe.prices.retrieve(newYearsPromo);
                const finalAmount = basePrice.unit_amount - promoPrice.unit_amount + accessCard.unit_amount;
                items = [{
                    price_data: {
                        currency: 'php',
                        product: basePrice.product,
                        unit_amount: finalAmount,
                        recurring: {
                            interval: 'year',
                        },
                    }
                }];
            } else if (promo === "Summer Promo") {
                const promoPrice = await stripe.prices.retrieve(summerPromo);
                const finalAmount = basePrice.unit_amount - promoPrice.unit_amount + accessCard.unit_amount;
                items = [{
                    price_data: {
                        currency: 'php',
                        product: basePrice.product,
                        unit_amount: finalAmount,
                        recurring: {
                            interval: 'year',
                        },
                    }
                }];
            }

            // Create the subscription
            const subscription = await stripe.subscriptions.create({
                customer: customerId,
                items,
                payment_behavior: 'default_incomplete',
                expand: ['latest_invoice.payment_intent'],
            });

            const stripeSubscriptionId = subscription.id;
            const clientSecret = subscription.latest_invoice.payment_intent.client_secret;
            
            // console.log(stripeSubscriptionId);
            user.role = 'client';
            await user.save();

            res.json({ stripeSubscriptionId, clientSecret });
        } catch (error) {
            console.error("Backend Subscription Error:", error.message);
            res.status(400).json({ message: "Backend Subscription Error" });
        }
    },
    pspCreateSubscription: async (req, res) => {
        try {
            const {
                userId, userBranch, birthDate, address, city,
                phone, emergencyContactName, emergencyContactNumber,
                promo, agreeTerms, stripeSubscriptionId
            } = req.body;

            // console.log('Backend Request', req.body)

            if (!emergencyContactName || !emergencyContactNumber) {
                return res.status(400).json({
                    success: false,
                    message: "Emergency contact name and number are required.",
                });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            let transaction = new Transaction({
                transactionType: 'Membership Subscription',
                userId, userBranch, birthDate,
                address, city, phone, emergencyContactName,
                emergencyContactNumber, promo, agreeTerms, stripeSubscriptionId,
            });

            user.userBranch = userBranch;
            user.birthDate = birthDate;
            user.address = address;
            user.city = city;
            user.phone = phone;
            user.generalAccess = 'PSPCard';
            user.otherAccess = 'Any Valid ID';
            user.emergencyContactName = emergencyContactName;
            user.emergencyContactNumber = emergencyContactNumber;

            await user.save();
            transaction = await transaction.save();

            // console.log('transaction',transaction)

            return res.status(201).json({
                success: true,
                message: 'PSP Membership Transaction is Successful',
                transaction
            });

        } catch (error) {
            console.log(error.message);
            res.status(500).json({
                success: false,
                message: 'Error in Creating PSPPayment',
                error: error.message
            });
        }
    },
};

module.exports = paymentController;
