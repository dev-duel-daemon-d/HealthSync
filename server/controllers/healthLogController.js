const HealthLog = require('../models/HealthLog');

const getLogs = async (req, res) => {
    try {
        const logs = await HealthLog.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createLog = async (req, res) => {
    try {
        const { symptoms, vitals, mood, sleepHours, waterIntake, date } = req.body;

        const log = await HealthLog.create({
            user: req.user.id,
            date: date || Date.now(),
            symptoms,
            mood,
            sleepHours,
            waterIntake,
            vitals
        });

        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getLogs, createLog };
