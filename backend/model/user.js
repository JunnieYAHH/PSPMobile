const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
        },
        role: {
            type: String,
            required: [true, "role is required"],
            default: 'user',
            enum: ["admin", "client", "coach", 'user'],
        },
        phone: {
            type: String,
        },
        userBranch: {
            type: String,
        },
        password: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        image: [
            {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                },
            }
        ],
        stripeCustomerId: {
            type: String,
        },
    },
    { timestamps: true }
);

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

module.exports = mongoose.model("users", userSchema);