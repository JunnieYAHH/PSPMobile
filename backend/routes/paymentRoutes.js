const express = require('express');
const paymentController = require('../controller/paymentController');


const router = express.Router();
router.post("/intent", paymentController.paymentIntent);


module.exports = router;