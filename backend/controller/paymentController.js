const asyncHandler = require("express-async-handler");
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const User = require('../model/user');
const { cloudinary, secretKey } = require('../config/cloudinaryConfig')
const Transaction = require('../model/transaction');
const sendPushNotification = require("../utils/sendNotification");
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
                promo, agreeTerms, stripeSubscriptionId, signature
            } = req.body;

            if (!signature) {
                return res.status(400).json({ success: false, message: "Signature is required" });
            }

            // Upload Base64 image directly to Cloudinary
            const result = await cloudinary.uploader.upload(signature, {
                folder: "PSPCloudinaryData/users",
                width: 150,
                crop: "scale",
            });

            // console.log("Signature uploaded to Cloudinary:", result.secure_url);
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

            // Retrieve base price and access card price
            const basePrice = await stripe.prices.retrieve(priceId);
            const accessCard = await stripe.prices.retrieve(accesscard);
            let finalAmount = basePrice.unit_amount + accessCard.unit_amount;

            // Apply promo discounts if applicable
            if (promo === "December Promo") {
                const promoPrice = await stripe.prices.retrieve(berMonthsPromo);
                finalAmount = basePrice.unit_amount - promoPrice.unit_amount + accessCard.unit_amount;
            } else if (promo === "New Year's Promo") {
                const promoPrice = await stripe.prices.retrieve(newYearsPromo);
                finalAmount = basePrice.unit_amount - promoPrice.unit_amount + accessCard.unit_amount;
            } else if (promo === "Summer Promo") {
                const promoPrice = await stripe.prices.retrieve(summerPromo);
                finalAmount = basePrice.unit_amount - promoPrice.unit_amount + accessCard.unit_amount;
            }

            // Set subscription dates
            const subscribedDate = new Date();
            const subscriptionExpiration = new Date();
            subscriptionExpiration.setFullYear(subscribedDate.getFullYear() + 1);

            // Update user fields
            user.userBranch = userBranch;
            user.birthDate = birthDate;
            user.role = 'client';
            user.address = address;
            user.city = city;
            user.phone = phone;
            user.generalAccess = 'PSPCard';
            user.otherAccess = 'Any Valid ID';
            user.emergencyContactName = emergencyContactName;
            user.emergencyContactNumber = emergencyContactNumber;
            user.subscribedDate = subscribedDate;
            user.subscriptionExpiration = subscriptionExpiration;
            user.isClient = true;

            // Save user and transaction
            finalAmount = finalAmount / 100;

            // Save user data
            await user.save();

            // Check if user already has a previous transaction
            let transaction = await Transaction.findOne({ userId, transactionType: 'Membership Subscription' });

            if (transaction) {
                // update existing transaction
                transaction.userBranch = userBranch;
                transaction.birthDate = birthDate;
                transaction.address = address;
                transaction.city = city;
                transaction.phone = phone;
                transaction.emergencyContactName = emergencyContactName;
                transaction.emergencyContactNumber = emergencyContactNumber;
                transaction.promo = promo;
                transaction.agreeTerms = agreeTerms;
                transaction.subscribedDate = subscribedDate;
                transaction.subscriptionExpiration = subscriptionExpiration;
                transaction.stripeSubscriptionId = stripeSubscriptionId;
                transaction.amount = finalAmount;
                transaction.signature = { public_id: result.public_id, url: result.secure_url };

                await transaction.save();
            } else {
                // create new if doesn't exist
                transaction = new Transaction({
                    transactionType: 'Membership Subscription',
                    userId, userBranch, birthDate,
                    address, city, phone, emergencyContactName,
                    emergencyContactNumber, promo, agreeTerms,
                    subscribedDate, subscriptionExpiration, stripeSubscriptionId,
                    amount: finalAmount,
                    signature: { public_id: result.public_id, url: result.secure_url },
                });

                await transaction.save();
            }

            // 🔔 Notify admins in the same branch
            const admins = await User.find({
                role: 'admin',
                userBranch: userBranch,
                expoPushToken: { $ne: null }, // Ensure they have a push token
            });

            const notifyAdmins = admins.map(async (admin) => {
                const title = 'New PSP Membership';
                const body = `${user.name} has successfully subscribed at your branch.`;

                // Push notification
                await sendPushNotification(admin.expoPushToken, title, body, admin.role);
            });

            await Promise.all(notifyAdmins);


            return res.status(201).json({
                success: true,
                message: 'PSP Membership Transaction is Successful',
                transaction
            });

        } catch (error) {
            console.log(error.message);
            res.status(500).json({
                success: false,
                message: 'Error in Creating PSPPayment Subscription',
                error: error.message
            });
        }
    }
};

module.exports = paymentController;
