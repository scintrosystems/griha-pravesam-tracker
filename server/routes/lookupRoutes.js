const express = require('express');
const router = express.Router();
const Lookup = require('../models/Lookup');
const auth = require('../middleware/auth');

// GET all lookups (or filter by ?type=LOCATION)
router.get('/', async (req, res) => {
    try {
        const filter = req.query.type ? { type: req.query.type } : {};
        const lookups = await Lookup.find(filter).sort({ name: 1 });
        res.json(lookups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new lookup item
router.post('/', auth, async (req, res) => {
    try {
        const lookup = new Lookup(req.body);
        await lookup.save();
        res.status(201).json(lookup);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE lookup item
router.delete('/:id', auth, async (req, res) => {
    try {
        await Lookup.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lookup deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;