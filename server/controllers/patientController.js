const HealthLog = require('../models/HealthLog');
const User = require('../models/User');
const ConnectionRequest = require('../models/ConnectionRequest');

// @desc    Get patient health logs
// @route   GET /api/patient/logs
// @access  Private (Patient)
const getPatientLogs = async (req, res) => {
    try {
        const logs = await HealthLog.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create health log
// @route   POST /api/patient/logs
// @access  Private (Patient)
const createHealthLog = async (req, res) => {
    const { mood, notes, vitals } = req.body;

    if (!mood) {
        return res.status(400).json({ message: 'Please add a mood' });
    }

    try {
        const log = await HealthLog.create({
            user: req.user.id,
            mood,
            notes,
            vitals,
            date: new Date()
        });
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all approved doctors with optional search
// @route   GET /api/patient/doctors
// @access  Private
const getAllDoctors = async (req, res) => {
    try {
        const { search } = req.query;
        let query = { 
            role: 'doctor', 
            status: 'approved' 
        };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { specialization: { $regex: search, $options: 'i' } }
            ];
        }

        const doctors = await User.find(query).select('-password -patients -connectionCode');
        res.status(200).json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Request connection with a doctor
// @route   POST /api/patient/request-connection
// @access  Private
const requestConnection = async (req, res) => {
    const { doctorId, message } = req.body;
    const patientId = req.user.id;

    try {
        // Check if already connected
        const patient = await User.findById(patientId);
        if (patient.doctors.includes(doctorId)) {
            return res.status(400).json({ message: 'Already connected to this doctor' });
        }

        // Check if pending request exists
        const existingRequest = await ConnectionRequest.findOne({
            doctor: doctorId,
            patient: patientId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Request already pending' });
        }

        const newRequest = await ConnectionRequest.create({
            doctor: doctorId,
            patient: patientId,
            message
        });

        res.status(201).json(newRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get my sent requests
// @route   GET /api/patient/requests
// @access  Private
const getMyRequests = async (req, res) => {
    try {
        const requests = await ConnectionRequest.find({ patient: req.user.id })
            .populate('doctor', 'name specialization')
            .sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Cancel/Revoke a pending connection request
// @route   DELETE /api/patient/requests/:id
// @access  Private
const cancelConnectionRequest = async (req, res) => {
    try {
        const request = await ConnectionRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Verify ownership
        if (request.patient.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot cancel processed request' });
        }

        await request.deleteOne();
        res.status(200).json({ message: 'Request cancelled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getPatientLogs,
    createHealthLog,
    getAllDoctors,
    requestConnection,
    getMyRequests,
    cancelConnectionRequest
};