const express = require('express');
const router = express.Router();
const { 
    getPatientLogs, 
    createHealthLog, 
    getAllDoctors, 
    requestConnection, 
    getMyRequests,
    cancelConnectionRequest
} = require('../controllers/patientController');const { protect } = require('../middleware/authMiddleware');

router.get('/logs', protect, getPatientLogs);
router.post('/logs', protect, createHealthLog);
router.get('/doctors', protect, getAllDoctors);
router.post('/request-connection', protect, requestConnection);
router.get('/requests', protect, getMyRequests);
router.delete('/requests/:id', protect, cancelConnectionRequest);

module.exports = router;
