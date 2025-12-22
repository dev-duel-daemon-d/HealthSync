const Medication = require('../models/Medication');

const getMedications = async (req, res) => {
    try {
        const medications = await Medication.find({ user: req.user.id }).populate('prescribedBy', 'name');
        res.status(200).json(medications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createMedication = async (req, res) => {
    try {
        const { name, dosage, frequency, startDate, endDate, timeOfIntake } = req.body;

        if (!name || !dosage || !frequency || !startDate) {
            return res.status(400).json({ message: 'Please complete all required fields' });
        }

        const medication = await Medication.create({
            user: req.user.id,
            name,
            dosage,
            frequency,
            startDate,
            endDate,
            timeOfIntake
        });

        res.status(201).json(medication);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateMedication = async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id);

        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        if (medication.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedMedication = await Medication.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedMedication);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteMedication = async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id);

        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        if (medication.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await medication.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getMedications,
    createMedication,
    updateMedication,
    deleteMedication
};
