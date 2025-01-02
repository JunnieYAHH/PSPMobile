const mongoose = require('mongoose');

const availTrainerSchema = new mongoose.Schema({
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
    number: { 
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
    endDate: { 
        type: Date 
    },
    package: { 
        type: String, 
        required: true 
    },
    payment: { 
        type: String, 
        required: true 
    },
    billing: { 
        type: String, 
        required: true 
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const AvailTrainer = mongoose.model('AvailTrainer', availTrainerSchema);

module.exports = AvailTrainer;
