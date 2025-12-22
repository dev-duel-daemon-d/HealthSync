const User = require('../models/User');
const Medication = require('../models/Medication');
const HealthLog = require('../models/HealthLog');
const crypto = require('crypto');

// @desc    Generate a unique connection code for the doctor
// @route   POST /api/doctor/generate-code
// @access  Private (Doctor only)
const generateConnectionCode = async (req, res) => {
    try {
        // Generate a simple 6-character code (e.g., 'DOC-A1B2')
        // In a real app, ensure uniqueness with a loop or database check
        const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
        const code = `DOC-${randomPart}`;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { connectionCode: code },
            { new: true }
        );

        res.json({ connectionCode: updatedUser.connectionCode });
    } catch (error) {
        res.status(500).json({ message: 'Error generating code' });
    }
};

// @desc    Get list of patients linked to this doctor
// @route   GET /api/doctor/patients
// @access  Private (Doctor only)
const getMyPatients = async (req, res) => {
    try {
        const doctor = await User.findById(req.user._id).populate('patients', 'name email createdAt');
        res.json(doctor.patients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients' });
    }
};

// @desc    Get specific patient's health logs
// @route   GET /api/doctor/patient/:patientId/logs
// @access  Private (Doctor only)
const getPatientLogs = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Verify this patient is linked to this doctor
        const isLinked = req.user.patients.includes(patientId);
        if (!isLinked) {
            return res.status(403).json({ message: 'Not authorized to view this patient' });
        }

        const logs = await HealthLog.find({ user: patientId }).sort({ date: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs' });
    }
};

// @desc    Prescribe medication to a patient
// @route   POST /api/doctor/prescribe
// @access  Private (Doctor only)
const prescribeMedication = async (req, res) => {
    const { patientId, name, dosage, frequency, startDate } = req.body;

    if (!patientId || !name || !dosage || !frequency) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // Verify linkage
        if (!req.user.patients.includes(patientId)) {
            return res.status(403).json({ message: 'Not authorized to treat this patient' });
        }

        const medication = await Medication.create({
            user: patientId,
            name,
            dosage,
            frequency,
            startDate: startDate || new Date(),
            prescribedBy: req.user._id,
            status: 'active'
        });

        res.status(201).json(medication);
    } catch (error) {
        res.status(500).json({ message: 'Error creating prescription' });
    }
};

// @desc    Connect a patient to a doctor using a code
// @route   POST /api/doctor/connect
// @access  Private (Patient)
const connectWithDoctor = async (req, res) => {
    const { connectionCode } = req.body;

    if (!connectionCode) {
        return res.status(400).json({ message: 'Connection code required' });
    }

    try {
        // Find doctor by code
        const doctor = await User.findOne({ connectionCode, role: 'doctor' });

        if (!doctor) {
            return res.status(404).json({ message: 'Invalid connection code' });
        }

        // Check if already connected
        if (doctor.patients.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already connected to this doctor' });
        }

        // Update both Doctor and Patient
        // 1. Add Patient to Doctor's list
        doctor.patients.push(req.user._id);
        await doctor.save();

        // 2. Add Doctor to Patient's list
        const patient = await User.findById(req.user._id);
        patient.doctors.push(doctor._id);
        await patient.save();

        res.json({ message: `Successfully connected with Dr. ${doctor.name}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error connecting to doctor' });
    }
};

module.exports = {
    generateConnectionCode,
    getMyPatients,
    getPatientLogs,
    prescribeMedication,
    connectWithDoctor
};
