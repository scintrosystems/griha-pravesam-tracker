const mongoose = require('mongoose');

const tabSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    label: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'bi-folder'
    },
    order: {
        type: Number,
        default: 0
    },
    isCustom: {
        type: Boolean,
        default: false
    },
    // Stores field definitions for custom tabs
    customFields: [
        {
            key: String,
            label: String,
            type: { type: String, default: 'text' } // text, number, date, time
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Tab', tabSchema);