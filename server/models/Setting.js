const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    showOverallExpensesToPublic: { type: Boolean, default: false },
    showSectionExpensesToPublic: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);