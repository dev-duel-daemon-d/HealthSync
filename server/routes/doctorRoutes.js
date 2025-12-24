const express = require('express');
const router = express.Router();
const { 
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
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/patients', protect, getDoctorPatients);
router.post('/generate-code', protect, generateConnectionCode);
router.get('/patient/:id/logs', protect, getPatientLogsForDoctor);
router.get('/appointments', protect, getDoctorAppointments);
router.patch('/appointments/:id/status', protect, updateAppointmentStatus);
router.post('/prescribe', protect, prescribeMedication);
router.get('/prescriptions', protect, getDoctorPrescriptions);
router.delete('/prescriptions/:id', protect, deletePrescription);
router.put('/prescriptions/:id', protect, updatePrescription);

// New Routes
router.get('/requests', protect, getConnectionRequests);
router.put('/requests/:id', protect, handleConnectionRequest);

module.exports = router;
