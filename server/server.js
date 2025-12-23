const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true
    }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Socket.io Logic
const Message = require('./models/Message');
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (appointmentId) => {
        socket.join(appointmentId);
        console.log(`User joined room: ${appointmentId}`);
    });

    socket.on('send_message', async (data) => {
        const { appointmentId, senderId, text } = data;
        
        try {
            // Save to DB
            const newMessage = await Message.create({
                appointment: appointmentId,
                sender: senderId,
                text
            });
            
            // Emit to room
            io.to(appointmentId).emit('receive_message', newMessage);
        } catch (error) {
            console.error('Socket message error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/medications', require('./routes/medicationRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/logs', require('./routes/healthLogRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/patient', require('./routes/patientRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.get('/', (req, res) => {
    res.send('HealthSync API is running with Socket.io');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthsync')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
