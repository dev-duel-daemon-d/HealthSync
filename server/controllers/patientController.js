const User = require('../models/User');
const Medication = require('../models/Medication');

// @desc    Get list of doctors for the current patient
// @route   GET /api/patient/doctors
// @access  Private
const getMyDoctors = async (req, res) => {
    try {
        const patient = await User.findById(req.user._id).populate('doctors', 'name email specialization');
        res.json(patient.doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching doctors' });
    }
};

// @desc    Remove a doctor from patient's list
// @route   DELETE /api/patient/doctors/:doctorId
// @access  Private
const removeDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const patientId = req.user._id;

        // 1. Handover (Conversion): Convert doctor-managed meds to self-managed
        await Medication.updateMany(
            { user: patientId, prescribedBy: doctorId },
            { $set: { prescribedBy: null } }
        );

        // 2. Remove doctor from patient's list
        await User.findByIdAndUpdate(patientId, {
            $pull: { doctors: doctorId }
        });

        // 3. Remove patient from doctor's list
        await User.findByIdAndUpdate(doctorId, {
            $pull: { patients: patientId }
        });

        res.json({ message: 'Doctor removed successfully. Prescribed medications have been converted to self-managed.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing doctor' });
    }
};

module.exports = { getMyDoctors, removeDoctor };
