const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const auth = require('../middleware/auth');

// GET settings (Public - so visitors know whether to render expense cards)
router.get('/', async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create({
                showOverallExpensesToPublic: false,
                showSectionExpensesToPublic: false
            });
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update settings (Protected - Admin only)
router.put('/', auth, async (req, res) => {
    try {
        const { showOverallExpensesToPublic, showSectionExpensesToPublic } = req.body;
        let settings = await Setting.findOne();
        if (!settings) {
            settings = new Setting();
        }

        if (showOverallExpensesToPublic !== undefined) {
            settings.showOverallExpensesToPublic = showOverallExpensesToPublic;
        }
        if (showSectionExpensesToPublic !== undefined) {
            settings.showSectionExpensesToPublic = showSectionExpensesToPublic;
        }

        await settings.save();
        res.json(settings);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;