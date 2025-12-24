const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    note: {
        type: String,
        maxLength: 500
    }
}, { timestamps: true });

// Ensure a patient can only have one active request (pending or accepted) per doctor
connectionRequestSchema.index({ doctor: 1, patient: 1 }, { unique: true });

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);
