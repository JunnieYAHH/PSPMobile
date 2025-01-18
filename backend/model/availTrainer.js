const mongoose = require('mongoose');

const availTrainerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    homePhone: {
        type: String
    },
    workPhone: {
        type: String
    },
    sessions: {
        type: Number,
        default: 0
    },
    sessionRate: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    coachID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function () {
            return this.status === 'active';
        },
        default: null,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    endDate: {
        type: Date
    },
    package: {
        type: String,
        required: true
    },
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const AvailTrainer = mongoose.model('AvailTrainer', availTrainerSchema);

module.exports = AvailTrainer;
