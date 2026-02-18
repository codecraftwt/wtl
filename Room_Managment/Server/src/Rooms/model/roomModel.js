const mongoose = require('mongoose');
const user = require('../../User/model/userModel');

const roomSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        latitude: { type: Number },
        longitude: { type: Number },
        country: { type: String },
        state: { type: String },
        city: { type: String }
    },
    noOfBeds: { type: Number, required: true },
    roomSize: { type: Number, required: true },
    maxOccupancy: { type: Number, required: true },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    pricePerDay: { type: Number, required: true },
    timeForCheckout: { type: Number, required: true },
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
