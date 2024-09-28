const mongoose = require('mongoose');

const WishlistItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    price: {
        type: Number,
        required: true
    },
    brandName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    selectedSize: {
        type: String,
        required: true
    },
    isInWishList: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('WishlistItem', WishlistItemSchema);
