const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const inputUser = (req.body.username || '').trim().toLowerCase();
        const inputPass = (req.body.password || '').trim();

        console.log(`\n👉 [Login Request Received]: Username="${inputUser}"`);

        const envUser = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
        const envPass = (process.env.ADMIN_PASSWORD || 'admin123').trim();

        // 1. DIRECT MATCH: If matches .env credentials, always grant access & sync DB
        if (inputUser === envUser && inputPass === envPass) {
            console.log('✅ Credentials matched .env! Granting login and syncing DB...');

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(envPass, salt);

            // Reset or create admin in database
            const admin = await Admin.findOneAndUpdate(
                { username: envUser },
                { username: envUser, password: hashedPassword },
                { upsert: true, new: true }
            );

            const token = jwt.sign(
                { id: admin._id, username: admin.username },
                process.env.JWT_SECRET || 'griha_pravesam_super_secure_jwt_secret_2026',
                { expiresIn: '7d' }
            );

            console.log('🎉 Token generated successfully!\n');
            return res.json({ token, username: admin.username });
        }

        // 2. Otherwise check database hash
        const admin = await Admin.findOne({ username: inputUser });
        if (!admin) {
            console.log('❌ User not found in database.');
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(inputPass, admin.password);
        if (!isMatch) {
            console.log('❌ Password does not match.');
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET || 'griha_pravesam_super_secure_jwt_secret_2026',
            { expiresIn: '7d' }
        );

        console.log('🎉 Login successful via database hash!\n');
        res.json({ token, username: admin.username });

    } catch (err) {
        console.error('❌ Server Login Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ valid: false });

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'griha_pravesam_super_secure_jwt_secret_2026'
        );
        res.json({ valid: true, admin: decoded });
    } catch (err) {
        res.status(401).json({ valid: false });
    }
});

module.exports = router;