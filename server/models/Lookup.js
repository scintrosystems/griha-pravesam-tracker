const mongoose = require('mongoose');

const lookupSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['LOCATION', 'PERSON', 'TRANSPORT_MODE', 'CATEGORY', 'MENU_ITEM']
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        default: ''
    },
    mapUrl: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Lookup', lookupSchema);