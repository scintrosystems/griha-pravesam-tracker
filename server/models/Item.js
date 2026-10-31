const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    tabSlug: {
        type: String,
        required: true,
        index: true
    },
    title: { type: String, required: true, trim: true },
    date: { type: String, default: '' },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    timeSlot: { type: String, default: '' },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Lookup' },
    inCharge: { type: mongoose.Schema.Types.ObjectId, ref: 'Lookup' },
    transportMode: { type: mongoose.Schema.Types.ObjectId, ref: 'Lookup' },
    description: { type: String, default: '' },
    status: {
        type: String,
        enum: ['Confirmed', 'In Progress', 'Scheduled', 'Pending', 'Completed'],
        default: 'Confirmed'
    },

    // ==========================================
    // UNIVERSAL FINANCIAL / EXPENSE FIELDS
    // ==========================================
    totalCost: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    paymentStatus: {
        type: String,
        enum: ['Unpaid', 'Partial', 'Paid'],
        default: 'Unpaid'
    },

    // Food
    hotelDetails: { type: String, default: '' },
    mealType: { type: String, default: '' },
    menuItems: { type: String, default: '' },
    headcount: { type: String, default: '' },
    bookedBy: { type: String, default: '' },

    // Rooms
    roomCount: { type: String, default: '' },
    headcountPerRoom: { type: String, default: '' },
    roomTariff: { type: String, default: '' },
    checkInDate: { type: String, default: '' },
    checkInTime: { type: String, default: '' },
    checkOutDate: { type: String, default: '' },
    checkOutTime: { type: String, default: '' },
    hotelContact: { type: String, default: '' },
    bookedBy: { type: String, default: '' },

    // Vehicles
    travelsDetails: { type: String, default: '' },
    vehicleModel: { type: String, default: '' },
    driverNumber: { type: String, default: '' },
    rentPerDay: { type: String, default: '' },
    kmRate: { type: String, default: '' },
    additionalCharges: { type: String, default: '' },
    pickupTime: { type: String, default: '' },
    route: { type: String, default: '' },

    // Purchase List
    amount: { type: String, default: '' },
    category: { type: String, default: '' },
    quantity: { type: String, default: '' },
    specifics: { type: String, default: '' },
    purchasedFrom: { type: String, default: '' },
    isPurchased: { type: Boolean, default: false },

    // Contacts
    role: { type: String, default: '' },
    phone: { type: String, default: '' },

    customData: {
        type: Map,
        of: String,
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);