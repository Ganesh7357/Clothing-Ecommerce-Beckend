const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    date: {
        type: Date,
        required: true
    },
    reviewTitle: {
        type: String,
        required: true
    },
    reviewText: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Review', ReviewSchema);
