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
    message: {
        type: String,
        maxlength: 500
    }
}, { timestamps: true });

// Prevent duplicate pending requests between same doctor and patient
connectionRequestSchema.index({ doctor: 1, patient: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } });

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);
