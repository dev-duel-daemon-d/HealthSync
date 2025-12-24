const express = require('express');
const router = express.Router();
const { protect, doctorOnly } = require('../middleware/authMiddleware');
const {
    getAllDoctors,
    getConnectionRequests,
    respondToConnectionRequest,
    generateConnectionCode,
    getMyPatients,
    getPatientLogs,
    prescribeMedication,
    connectWithDoctor,
    getMyPrescriptions,
    updatePrescription,
    deletePrescription,
    getDoctorAppointments,
    updateAppointmentStatus
} = require('../controllers/doctorController');

// Shared/Patient Routes
router.get('/all', protect, getAllDoctors);
router.post('/connect', protect, connectWithDoctor);

// Doctor Routes
router.get('/connection-requests', protect, doctorOnly, getConnectionRequests);
router.put('/connection-requests/:id', protect, doctorOnly, respondToConnectionRequest);
router.post('/generate-code', protect, doctorOnly, generateConnectionCode);
router.get('/patients', protect, doctorOnly, getMyPatients);
router.get('/patient/:patientId/logs', protect, doctorOnly, getPatientLogs);
router.post('/prescribe', protect, doctorOnly, prescribeMedication);
router.get('/prescriptions', protect, doctorOnly, getMyPrescriptions);
router.put('/prescriptions/:id', protect, doctorOnly, updatePrescription);
router.delete('/prescriptions/:id', protect, doctorOnly, deletePrescription);

// Doctor Appointment Routes
router.get('/appointments', protect, doctorOnly, getDoctorAppointments);
router.patch('/appointments/:id/status', protect, doctorOnly, updateAppointmentStatus);

module.exports = router;
