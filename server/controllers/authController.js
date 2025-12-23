const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate Access Token (Short lived, e.g. 15m)
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
};

// Generate Refresh Token (Long lived, e.g. 7d)
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, licenseNumber } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default status: Patients are approved immediately, Doctors are pending
    const initialStatus = role === 'doctor' ? 'pending' : 'approved';

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'patient',
        status: initialStatus,
        licenseNumber: licenseNumber || ''
    });

    if (user) {
        const refreshToken = generateRefreshToken(user._id);

        // Send refresh token in HTTP-only cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            token: generateAccessToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, passwordLength: password?.length });

    // Check for user email
    const user = await User.findOne({ email });

    console.log('User found:', user ? 'Yes' : 'No');

    if (user && (await bcrypt.compare(password, user.password))) {
        console.log('Password match: Yes');
        const refreshToken = generateRefreshToken(user._id);

        // Send refresh token in HTTP-only cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            token: generateAccessToken(user._id)
        });
    } else {
        console.log('Login failed - Invalid credentials');
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (with cookie)
const refresh = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });

        const user = await User.findById(decoded.id);

        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const accessToken = generateAccessToken(user._id);

        res.json({ accessToken });
    });
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict', secure: true });
    res.json({ message: 'Cookie cleared' });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    refresh,
    logout
};
