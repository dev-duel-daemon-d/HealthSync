const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    },
    frequency: {
        type: String, // e.g., "Daily", "Twice Daily"
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    timeOfIntake: [{
        type: String // e.g., "08:00"
    }],
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Medication', medicationSchema);
