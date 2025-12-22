const express = require('express');
const router = express.Router();
const { protect, doctorOnly } = require('../middleware/authMiddleware');
const {
    generateConnectionCode,
    getMyPatients,
    getPatientLogs,
    prescribeMedication,
    connectWithDoctor
} = require('../controllers/doctorController');

// Patient Routes
router.post('/connect', protect, connectWithDoctor);

// Doctor Routes
router.post('/generate-code', protect, doctorOnly, generateConnectionCode);
router.get('/patients', protect, doctorOnly, getMyPatients);
router.get('/patient/:patientId/logs', protect, doctorOnly, getPatientLogs);
router.post('/prescribe', protect, doctorOnly, prescribeMedication);

module.exports = router;
