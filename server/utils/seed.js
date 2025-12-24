const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Medication = require('../models/Medication');
const Appointment = require('../models/Appointment');
const HealthLog = require('../models/HealthLog');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthsync');
        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await Medication.deleteMany({});
        await Appointment.deleteMany({});
        await HealthLog.deleteMany({});

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        console.log('Creating users...');
        
        const doctor = await User.create({
            name: 'Smith',
            email: 'doctor@example.com',
            password: hashedPassword,
            role: 'doctor',
            specialization: 'Cardiology',
            licenseNumber: 'MD-99887',
            status: 'approved'
        });

        const patient = await User.create({
            name: 'John Doe',
            email: 'patient@example.com',
            password: hashedPassword,
            role: 'patient',
            doctors: [doctor._id] // Link to doctor
        });

        // Add patient to doctor's list
        doctor.patients = [patient._id];
        await doctor.save();

        const caregiver = await User.create({
            name: 'Jane Caregiver',
            email: 'caregiver@example.com',
            password: hashedPassword,
            role: 'caregiver'
        });

        // Create Medications
        await Medication.create([
            {
                user: patient._id,
                name: 'Lisinopril',
                dosage: '10mg',
                frequency: 'Daily',
                startDate: new Date(),
                timeOfIntake: ['08:00'],
                prescribedBy: doctor._id
            },
            {
                user: patient._id,
                name: 'Metformin',
                dosage: '500mg',
                frequency: 'Twice Daily',
                startDate: new Date(),
                timeOfIntake: ['08:00', '20:00'],
                prescribedBy: doctor._id
            }
        ]);

        // Create Appointments
        await Appointment.create([
            {
                user: patient._id,
                doctor: doctor._id,
                doctorName: 'Dr. Smith',
                date: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
                location: 'City Hospital',
                notes: 'Regular checkup',
                status: 'confirmed'
            }
        ]);

        // Create Logs
        await HealthLog.create([
            {
                user: patient._id,
                mood: 'Happy',
                notes: 'Feeling much better today.',
                vitals: { bloodPressure: '120/80', heartRate: 72 },
                date: new Date()
            }
        ]);

        console.log('Data Seeded Successfully');
        console.log('------------------------');
        console.log('Patient: patient@example.com / password123');
        console.log('Doctor:  doctor@example.com / password123');
        console.log('------------------------');
        
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();