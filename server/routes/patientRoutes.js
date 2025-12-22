const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMyDoctors, removeDoctor } = require('../controllers/patientController');

router.get('/doctors', protect, getMyDoctors);
router.delete('/doctors/:doctorId', protect, removeDoctor);

module.exports = router;
