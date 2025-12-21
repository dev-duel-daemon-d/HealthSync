const Appointment = require('../models/Appointment');

const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.user.id }).sort({ date: 1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createAppointment = async (req, res) => {
    try {
        const { doctorName, date, location, notes } = req.body;

        if (!doctorName || !date || !location) {
            return res.status(400).json({ message: 'Please complete required fields' });
        }

        const appointment = await Appointment.create({
            user: req.user.id,
            doctorName,
            date,
            location,
            notes
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        if (appointment.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        if (appointment.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        await appointment.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getAppointments, createAppointment, updateAppointment, deleteAppointment };
