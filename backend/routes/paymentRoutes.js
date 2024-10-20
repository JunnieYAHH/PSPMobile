const express = require('express');
const paymentController = require('../controller/paymentController');


const router = express.Router();
router.post("/create-subscription", paymentController.createSubscription);


module.exports = router;