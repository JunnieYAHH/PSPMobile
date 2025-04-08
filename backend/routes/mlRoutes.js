const express = require("express");
const axios = require("axios");
const baseURL = require("../utils/baseUrl");
const router = express.Router();

router.get("/logs-prediction", async (req, res) => {
    try {
        const response = await axios.get(`${baseURL}/api/v1/ml/logs-prediction`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching predictions", error });
    }
});

module.exports = router;
