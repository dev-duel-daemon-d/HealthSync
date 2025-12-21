const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    symptoms: {
        type: String
    },
    mood: {
        type: String,
        enum: ['Happy', 'Neutral', 'Sad', 'Stressed', 'Anxious'],
        default: 'Neutral'
    },
    sleepHours: {
        type: Number
    },
    waterIntake: {
        type: Number
    },
    vitals: {
        bloodPressure: String,
        heartRate: Number,
        temperature: Number,
        weight: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('HealthLog', healthLogSchema);
