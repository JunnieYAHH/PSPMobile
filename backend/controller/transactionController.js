const asyncHandler = require("express-async-handler");
const Transaction = require("../model/transaction");

const transactionController = {
  getAllTransactions: asyncHandler(async (req, res) => {
    try {
      const transactions = await Transaction.find()
      // console.log(exercise)
      res.status(201).json({ message: "Transactions fetch successfully", transactions });
    } catch (error) {
      console.error("Fetch All Transactions Error:", error.message);
      res.status(500).json({ message: "Fetch Transactions Error" });
    }
  }),
  getMembershipInfo: asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const transaction = await Transaction.findOne({ userId: id });
      // if (!transaction) {
      //   return res.status(404).json({
      //     success: false,
      //     message: "Transaction not found",
      //   });
      // }

      console.log(transaction)

      return res.status(200).json({
        success: true,
        transaction,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching Transaction data",
        error: error.message,
      });
    }
  }),
};
module.exports = transactionController;