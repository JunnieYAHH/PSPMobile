const AvailTrainer = require('../model/availTrainer');
const User = require('../model/user')
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { cloudinary, secretKey } = require('../config/cloudinaryConfig')
const sendPushNotification = require("../utils/sendNotification");

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, userId } = req.body;
        // Create the payment intent 
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const customerId = user.stripeCustomerId;
            // console.log(customerId)

            if (!customerId) {
                return res.status(400).json({ message: 'No Stripe customer ID found for this user' });
            }
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: 'php',
                customer: customerId,
            });
            res.send({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
            console.error('Error creating payment intent:', error);
            res.status(500).json({ message: 'Error creating payment intent', error: error.message });
        }
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: 'Error creating payment intent' });
    }
};

// Create a new trainer
exports.createTrainer = async (req, res) => {
    try {
        req.body.schedule = [];
        for (let i = 0; i < req.body.sessions; i++) {
            req.body.schedule.push({
                index: i + 1,
                dateAssigned: null,
                timeAssigned: null,
                status: 'pending',
                trainings: [],
            });
        }

        let signatureData = [];
        if (req.body.signature) {
            try {
                const result = await cloudinary.uploader.upload(req.body.signature, {
                    folder: "PSPCloudinaryData/users",
                    width: 150,
                    crop: "scale",
                });

                signatureData.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            } catch (uploadError) {
                console.error("Cloudinary upload failed:", uploadError);
                return res.status(500).json({ message: "Signature upload failed", error: uploadError.message });
            }
        }

        const trainer = new AvailTrainer({
            ...req.body,
            signature: signatureData,
        });

        await trainer.save();

        // 🔔 Notify admins from the same branch
        const { userId, userBranch, name } = req.body;

        const admins = await User.find({
            role: 'admin',
            userBranch: userBranch,
            expoPushToken: { $ne: null },
        });

        const notifyAdmins = admins.map(async (admin) => {
            const title = 'New Trainer Session';
            const body = `${name} booked ${req.body.sessions} training session(s). Assign a Coach Now.`;

            // Push notification
            await sendPushNotification(admin.expoPushToken, title, body, admin.role);
        });

        await Promise.all(notifyAdmins);

        res.status(201).json({ message: 'Trainer created successfully', trainer });
    } catch (error) {
        console.error("Error creating trainer:", error);
        res.status(400).json({ message: 'Error creating trainer', error: error.message });
    }
};

// Get all trainers
exports.getAllTrainers = async (req, res) => {
    try {
        const { userBranch } = req.body;

        const trainers = await AvailTrainer.find()
            .populate({
                path: 'userId',
                model: 'users',
                select: 'userBranch',
            })
            .populate({
                path: 'coachID',
                model: 'users',
                select: 'email userBranch',
            })
            .sort({ createdAt: -1 });

        const filtered = trainers.filter(trainer => {
            const userBranchId1 = trainer.userId?.userBranch?._id || trainer.userId?.userBranch;
            const userBranchId2 = trainer.coachID?.userBranch?._id || trainer.coachID?.userBranch;

            return (
                userBranchId1?.toString() === userBranch ||
                userBranchId2?.toString() === userBranch
            );
        });

        res.status(200).json(filtered);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching trainers', error: error.message });
    }
};

// Get a specific trainer by ID
exports.getTrainerById = async (req, res) => {
    try {
        const trainer = await AvailTrainer.findById(req.params.id).populate({
            path: 'userId',
            model: 'users'
        }).populate({
            path: 'coachID',
            model: 'users'
        })
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        res.status(200).json(trainer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trainer', error: error.message });
    }
};

exports.updateTrainer = async (req, res) => {
    try {
        const { coachID, clientId } = req.body;

        const trainer = await AvailTrainer.findByIdAndUpdate(
            req.params.id,
            { coachID: coachID },
            { new: true, runValidators: true }
        );

        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        const coach = await User.findById(coachID);
        const client = await User.findById(clientId);

        if (!coach || !client) {
            return res.status(404).json({ message: 'Coach or Client not found' });
        }

        const notifBodyForCoach = `${client.name} has been assigned to you for training.`;
        const notifBodyForClient = `Coach ${coach.name} has been assigned to you for your training.`;

        const pushNotifications = [];

        if (coach.expoPushToken) {
            pushNotifications.push(
                sendPushNotification(
                    coach.expoPushToken,
                    'New Client Assigned',
                    notifBodyForCoach,
                    coach.role
                )
            );
        }

        if (client.expoPushToken) {
            pushNotifications.push(
                sendPushNotification(
                    client.expoPushToken,
                    'Trainer Assigned',
                    notifBodyForClient,
                    client.role
                )
            );
        }

        await Promise.all(pushNotifications);

        res.status(200).json({
            message: 'Trainer updated successfully, notifications sent.',
            trainer,
        });
    } catch (error) {
        console.error('Error updating trainer:', error);
        res.status(400).json({
            message: 'Error updating trainer',
            error: error.message,
        });
    }
};

// Delete a trainer by ID
exports.deleteTrainer = async (req, res) => {
    try {
        const trainer = await AvailTrainer.findByIdAndDelete(req.params.id);
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        res.status(200).json({ message: 'Trainer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting trainer', error: error.message });
    }
};

exports.getByAssignedCoach = async (req, res,) => {

    try {
        const trainers = await AvailTrainer.find({ coachID: req.params.id }).populate({
            path: 'userId',
            model: 'users'
        }).populate({
            path: 'coachID',
            model: 'users'
        })

        // console.log(trainers)

        res.status(200).json(trainers);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching trainers', error: error.message });
    }

}

exports.getClientsAvailedServices = async (req, res,) => {

    try {
        // console.log(req.params)

        const trainers = await AvailTrainer.find({ userId: req.params.id }).populate({
            path: 'userId',
            model: 'users'
        }).populate({
            path: 'coachID',
            model: 'users'
        })

        // console.log(trainers)

        res.status(200).json(trainers);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching trainers', error: error.message });
    }

}

exports.updateSessionSchedule = async (req, res) => {
    try {
        const { clientID, coachName, date, time, trainings } = req.body;

        const servicesAvailed = await AvailTrainer.findById(req.params.id);

        servicesAvailed.schedule = servicesAvailed.schedule.map(session => {
            if (session._id.toString() === req.query.sessionId) {
                return {
                    ...session._doc,
                    dateAssigned: date,
                    timeAssigned: time,
                    status: 'waiting',
                    trainings: trainings || [],
                };
            }
            return session;
        });
        await servicesAvailed.save();

        const client = await User.findById(clientID);
        // Convert to readable date/time formats
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const formattedTime = new Date(time).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        // console.log(client,'Client')
        if (client.expoPushToken) {
            await sendPushNotification(
                client.expoPushToken,
                'New Training Session Scheduled',
                `Coach ${coachName} scheduled a session on ${formattedDate} at ${formattedTime}.`,
                client.role
            );
        }
        res.status(200).json({
            message: 'Session schedule updated and notification sent',
        });
    } catch (error) {
        console.error('Error updating session schedule:', error);
        res.status(500).json({
            message: 'Error updating session schedule',
            error: error.message,
        });
    }
};

exports.cancelSessionSchedule = async (req, res,) => {
    try {
        const { coachName, clientID } = req.body;

        const servicesAvailed = await AvailTrainer.findById(req.params.id);
        if (!servicesAvailed) {
            return res.status(404).json({ message: "Training service not found" });
        }

        let cancelledSession;
        servicesAvailed.schedule = servicesAvailed.schedule.map((session) => {
            if (session._id.toString() === req.query.sessionId) {
                cancelledSession = session;
                return {
                    ...session._doc,
                    dateAssigned: null,
                    timeAssigned: null,
                    status: "pending",
                };
            }
            return session;
        });

        await servicesAvailed.save();

        let formattedDate = "previous date";
        let formattedTime = "previous time";
        if (cancelledSession?.dateAssigned && cancelledSession?.timeAssigned) {
            formattedDate = new Date(cancelledSession.dateAssigned).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            formattedTime = new Date(cancelledSession.timeAssigned).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        }

        const message = `Coach ${coachName} cancelled your scheduled session on ${formattedDate} at ${formattedTime}.`;

        // Get client's push token and send push notification
        const client = await User.findById(clientID);
        if (client?.expoPushToken) {
            await sendPushNotification(
                client.expoPushToken,
                "Training Session Cancelled",
                message,
                client.role
            );
        }

        res.status(200).json({ message: "Session schedule cancelled and client notified." });
    } catch (error) {
        console.error("Cancel Session Error:", error);
        res.status(500).json({ message: "Error cancelling session", error: error.message });
    }
}

exports.completeSessionSchedule = async (req, res,) => {

    try {
        const servicesAvailed = await AvailTrainer.findById(req.params.id);

        servicesAvailed.schedule = servicesAvailed.schedule.map(session => {
            if (session._id.toString() === req.query.sessionId) {
                return {
                    ...session._doc,
                    status: 'completed',
                };
            }
            return session;
        });

        const allCompleted = servicesAvailed.schedule.every(session => session.status === 'completed');

        if (allCompleted) {
            servicesAvailed.status = 'inactive';
        }

        await servicesAvailed.save();

        res.status(200).json({
            message: "Session completed",
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching trainers', error: error.message });
    }

}

exports.hasActiveTraining = async (req, res) => {
    try {

        // console.log("Trainer ID:", req.params.id);
        const trainer = await AvailTrainer.findOne({ userId: req.params.id, status: 'active' });

        if (trainer) {
            return res.status(200).json({
                message: 'User has active training',
                training: trainer,
                hasActive: true,
            });
        }

        return res.status(404).json({ message: 'User does not have active training', hasActive: false });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'System failure, please try again later',
            error: err.message
        });
    }
}

exports.getCoachDateSessions = async (req, res) => {
    try {
        const { coachId } = req.params;

        // Find clients assigned to the coach
        const clients = await AvailTrainer.find({ coachID: coachId }).populate('userId');

        if (!clients.length) {
            return res.status(404).json({ message: "No clients found" });
        }

        // Sort clients by the most recent session date
        clients.sort((a, b) => {
            const dateA = new Date(a.schedule[a.schedule.length - 1]?.dateAssigned || 0);
            const dateB = new Date(b.schedule[b.schedule.length - 1]?.dateAssigned || 0);
            return dateB - dateA; // Descending order
        });

        // Return the client with the most recent session
        res.status(200).json({ recentClient: clients[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};