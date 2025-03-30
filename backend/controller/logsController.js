const mongoose = require("mongoose");
const Logs = require("../model/logs");

const logsController = {
    getAllLogs: async (req, res) => {
        try {
            const logs = await Logs.find()
            // console.log(exercise)
            res.status(201).json({ message: "Logs fetch successfully", logs });
        } catch (error) {
            console.error("Fetch All Logs Error:", error.message);
            res.status(500).json({ message: "Fetch Logs Error" });
        }
    },
    getAllUserLogs: async (req, res) => {
        try {
            const { id } = req.params;
            const logs = await Logs.find({ userId: id }).sort({ date: -1 })
            console.log(logs)
            res.status(201).json({ message: "Logs fetch successfully", logs });
        } catch (error) {
            console.error("Fetch All Logs Error:", error.message);
            res.status(500).json({ message: "Fetch Logs Error" });
        }
    },
    getMyLogs: async (req, res) => {
        try {
            const { id } = req.params;
            const now = new Date();

            // Get the first day of the current month
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

            // Get the last day of the current month
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

            console.log("Start of month:", startOfMonth);
            console.log("End of month:", endOfMonth);

            // Query logs in UTC+8 range
            const logs = await Logs.find({
                userId: id,
                date: { $gte: startOfMonth, $lte: endOfMonth }
            });

            console.log(logs, 'MyLogs');

            res.status(200).json({ message: "Logs fetched successfully", logs });
        } catch (error) {
            console.error("Fetch Logs Error:", error.message);
            res.status(500).json({ message: "Fetch Logs Error" });
        }
    },
};
module.exports = logsController;