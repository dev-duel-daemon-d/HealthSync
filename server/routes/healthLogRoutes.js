const express = require('express');
const router = express.Router();
const { getLogs, createLog } = require('../controllers/healthLogController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getLogs)
    .post(protect, createLog);

module.exports = router;
