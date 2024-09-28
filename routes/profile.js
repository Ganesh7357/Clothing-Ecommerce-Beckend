const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const authMiddleware = require('../middleware/authMiddleware');
// const upload = require('../middleware/upload');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Get Profile Data
router.get('/getProfile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Edit Profile
router.put('/updateProfile', authMiddleware, upload.single('profileImage'), async (req, res) => {
    console.log('Received fields:', req.body);
    console.log('Received file:', req.file);
    const { name, email, password } = req.body;

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        updatedFields.password = await bcrypt.hash(password, salt);
    }
    if (req.file) updatedFields.profileImage = `/uploads/${req.file.filename}`;

    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updatedFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
