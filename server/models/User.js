const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['patient', 'caregiver', 'doctor'],
        default: 'patient'
    },
    specialization: {
        type: String
    },
    connectionCode: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined values to not conflict
    },
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
