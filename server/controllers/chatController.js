const Message = require('../models/Message');

// @desc    Get chat history for an appointment
// @route   GET /api/chat/:appointmentId
// @access  Private
const getChatHistory = async (req, res) => {
    try {
        const messages = await Message.find({ appointment: req.params.appointmentId })
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat history' });
    }
};

module.exports = { getChatHistory };
