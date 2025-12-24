const User = require('../models/User');
const Appointment = require('../models/Appointment');
const HealthLog = require('../models/HealthLog');
const Medication = require('../models/Medication');
const ConnectionRequest = require('../models/ConnectionRequest');
const Notification = require('../models/Notification');

// @desc    Get all patients for doctor
// @route   GET /api/doctor/patients
// @access  Private (Doctor)
const getDoctorPatients = async (req, res) => {
    try {
        const doctor = await User.findById(req.user.id).populate('patients', 'name email');
        res.status(200).json(doctor.patients);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Generate Connection Code
// @route   POST /api/doctor/generate-code
// @access  Private (Doctor)
const generateConnectionCode = async (req, res) => {
    // Simple 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
        const doctor = await User.findById(req.user.id);
        doctor.connectionCode = code;
        await doctor.save();
        res.status(200).json({ connectionCode: code });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Patient Logs
// @route   GET /api/doctor/patient/:id/logs
// @access  Private (Doctor)
const getPatientLogsForDoctor = async (req, res) => {
    try {
        // Verify patient belongs to doctor
        const doctor = await User.findById(req.user.id);
        if (!doctor.patients.includes(req.params.id)) {
             return res.status(403).json({ message: 'Not authorized to view this patient' });
        }

        const logs = await HealthLog.find({ user: req.params.id }).sort({ date: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Doctor Appointments
// @route   GET /api/doctor/appointments
// @access  Private (Doctor)
const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user.id })
            .populate('user', 'name')
            .sort({ date: 1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Appointment Status
// @route   PATCH /api/doctor/appointments/:id/status
// @access  Private (Doctor)
const updateAppointmentStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        
        // Check ownership
        if (appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        appointment.status = status;
        await appointment.save();

        // Notify Patient
        await Notification.create({
            user: appointment.user,
            type: 'appointment',
            message: `Dr. ${req.user.name} has ${status} your appointment for ${new Date(appointment.date).toLocaleDateString()}`,
            relatedId: appointment._id
        });

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Prescribe Medication
// @route   POST /api/doctor/prescribe
// @access  Private (Doctor)
const prescribeMedication = async (req, res) => {
    const { patientId, medications, notes } = req.body; // medications is array
    
    try {
        // Verify patient
        const doctor = await User.findById(req.user.id);
        if (!doctor.patients.includes(patientId)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const createdMeds = [];
        for (const med of medications) {
             const newMed = await Medication.create({
                 user: patientId,
                 name: med.name,
                 dosage: med.dosage,
                 frequency: med.frequency,
                 startDate: med.startDate,
                 prescribedBy: req.user.id,
                 instructions: notes
             });
             createdMeds.push(newMed);
        }

        // Notify patient
        await Notification.create({
            user: patientId,
            type: 'prescription',
            message: `Dr. ${req.user.name} prescribed new medication(s).`,
            relatedId: createdMeds[0]._id
        });

        res.status(201).json(createdMeds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Prescriptions by Doctor
// @route   GET /api/doctor/prescriptions
// @access  Private (Doctor)
const getDoctorPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Medication.find({ prescribedBy: req.user.id })
            .populate('user', 'name');
        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete Prescription
// @route   DELETE /api/doctor/prescriptions/:id
// @access  Private (Doctor)
const deletePrescription = async (req, res) => {
    try {
        const med = await Medication.findById(req.params.id);
        if (!med) return res.status(404).json({ message: 'Not found' });
        
        if (med.prescribedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Medication.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Prescription
// @route   PUT /api/doctor/prescriptions/:id
// @access  Private (Doctor)
const updatePrescription = async (req, res) => {
    try {
        const med = await Medication.findById(req.params.id);
        if (!med) return res.status(404).json({ message: 'Not found' });
        
        if (med.prescribedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedMed = await Medication.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        ).populate('user', 'name');

        res.status(200).json(updatedMed);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get incoming connection requests
// @route   GET /api/doctor/requests
// @access  Private (Doctor)
const getConnectionRequests = async (req, res) => {
    try {
        const requests = await ConnectionRequest.find({ 
            doctor: req.user.id,
            status: 'pending'
        }).populate('patient', 'name email');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Handle connection request (accept/reject)
// @route   PUT /api/doctor/requests/:id
// @access  Private (Doctor)
const handleConnectionRequest = async (req, res) => {
    const { status } = req.body; // 'accepted' or 'rejected'
    const requestId = req.params.id;

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const request = await ConnectionRequest.findById(requestId);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        if (request.doctor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request already handled' });
        }

        request.status = status;
        await request.save();

        if (status === 'accepted') {
            // Update Doctor's patient list
            await User.findByIdAndUpdate(req.user.id, {
                $addToSet: { patients: request.patient }
            });

            // Update Patient's doctor list
            await User.findByIdAndUpdate(request.patient, {
                $addToSet: { doctors: req.user.id }
            });

            // Notify patient
            await Notification.create({
                user: request.patient,
                type: 'connection',
                message: `Dr. ${req.user.name} accepted your connection request.`,
                relatedId: req.user.id
            });
        }

        res.status(200).json({ message: `Request ${status}`, request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getDoctorPatients,
    generateConnectionCode,
    getPatientLogsForDoctor,
    getDoctorAppointments,
    updateAppointmentStatus,
    prescribeMedication,
    getDoctorPrescriptions,
    deletePrescription,
    updatePrescription,
    getConnectionRequests,
    handleConnectionRequest
};
