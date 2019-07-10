const mongoose = require('mongoose');


const listingSchema = new mongoose.Schema({
    place_name: {
        type: String
    },
    city: {
        type: String
    },
    streetName: {
        type: String
    },
    price: {
        type: String
    },
    no_of_rooms: {
        type: Number
    },
    no_of_persons: {
        type: Number
    },
    food_type: {
        type: String
    },
    facilities: {
        type: String
    },
    booking_status: {
        type: Boolean,
        default:false
    },
    image_name: {
        type: String
    },
    description: {
        type: String
    },
    userId: {
        type: String
    },
    booked_by: {
        type: String
    },
    approved_status: {
        type: String
    },

});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;