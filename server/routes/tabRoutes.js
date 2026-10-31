const express = require('express');
const router = express.Router();
const Tab = require('../models/Tab');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// Default core tabs
const DEFAULT_TABS = [
    { slug: 'schedule', label: 'Event Agenda', icon: 'bi-calendar-event', order: 1, isCustom: false },
    { slug: 'food', label: 'Food & Catering', icon: 'bi-egg-fried', order: 2, isCustom: false },
    { slug: 'rooms', label: 'Rooms & Lodging', icon: 'bi-building', order: 3, isCustom: false },
    { slug: 'vehicles', label: 'Vehicles & Taxis', icon: 'bi-car-front', order: 4, isCustom: false },
    { slug: 'purchase', label: 'Purchase List', icon: 'bi-bag-check', order: 5, isCustom: false },
    { slug: 'todo', label: 'To-Do Tasks', icon: 'bi-check2-square', order: 6, isCustom: false },
    { slug: 'contacts', label: 'Contact Directory', icon: 'bi-person-lines-fill', order: 7, isCustom: false }
];

// GET all tabs
router.get('/', async (req, res) => {
    try {
        let tabs = await Tab.find().sort({ order: 1 });
        if (tabs.length === 0) {
            tabs = await Tab.insertMany(DEFAULT_TABS);
        }
        res.json(tabs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new custom tab
router.post('/', auth, async (req, res) => {
    try {
        const { label, icon, customFields } = req.body;
        if (!label) return res.status(400).json({ error: 'Tab label is required' });

        const slug = label.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
        const count = await Tab.countDocuments();

        const newTab = new Tab({
            slug,
            label,
            icon: icon || 'bi-folder',
            order: count + 1,
            isCustom: true,
            customFields: customFields || []
        });

        await newTab.save();
        res.status(201).json(newTab);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a custom tab
router.delete('/:slug', auth, async (req, res) => {
    try {
        const { slug } = req.params;
        const tab = await Tab.findOne({ slug });
        if (!tab) return res.status(404).json({ error: 'Tab not found' });
        if (!tab.isCustom) return res.status(403).json({ error: 'Cannot delete core default tabs' });

        await Tab.deleteOne({ slug });
        await Item.deleteMany({ tabSlug: slug });
        res.json({ message: 'Tab and related records deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;