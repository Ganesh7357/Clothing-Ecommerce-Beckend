const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // id: {
    //     type: Number,
    //     required: true
    // },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    // profileImage: {
    //     type: String  // URL or path to the image
    // },
    cart: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          quantity: Number,
        },
      ],

},
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
