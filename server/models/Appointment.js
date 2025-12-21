const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: ['upcoming', 'completed', 'cancelled'],
        default: 'upcoming'
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
