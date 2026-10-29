const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// 1. GET items (Public: Guests & Admin can view)
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.tabSlug) filter.tabSlug = req.query.tabSlug;
        if (req.query.date) filter.date = req.query.date;

        const items = await Item.find(filter)
            .populate('location')
            .populate('inCharge')
            .populate('transportMode')
            .sort({ createdAt: -1 });

        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST create new item (Protected: Requires Admin Auth)
router.post('/', auth, async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();

        const populated = await Item.findById(item._id)
            .populate('location')
            .populate('inCharge')
            .populate('transportMode');

        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 3. PUT update existing item (Protected: Requires Admin Auth)
router.put('/:id', auth, async (req, res) => {
    try {
        const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('location')
            .populate('inCharge')
            .populate('transportMode');

        if (!updated) return res.status(404).json({ error: 'Item not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. PATCH cycle/update status or purchase checkbox (Protected: Requires Admin Auth)
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status, isPurchased } = req.body;
        const updateData = {};
        if (status !== undefined) updateData.status = status;
        if (isPurchased !== undefined) updateData.isPurchased = isPurchased;

        const item = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 5. DELETE item (Protected: Requires Admin Auth)
router.delete('/:id', auth, async (req, res) => {
    try {
        const deleted = await Item.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;