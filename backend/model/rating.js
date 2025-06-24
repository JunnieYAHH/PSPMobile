const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
    {
        coachId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema);
