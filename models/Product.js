const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    isInStock: { type: Boolean, required: true },
    gender: { type: String, required: true },
    category: { type: String, required: true },
    availableSizes: { type: [Number], required: true },
    rating: { type: Number, required: false },
    productionDate: { type: Date, required: true },
    price: {
        type: Number, required: true
    },
    brandName: { type: String, required: true },
    productCode: { type: String, required: true },
    // imageUrl: { type: String, required: false },
    // additionalImageUrls: { type: [String], required: false },
    productImage: { type: String }
},
    {
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated',
        },
        id: false,
        toJSON: {
            getters: true,
        },
        toObject: {
            getters: true,
        },
    });

module.exports = mongoose.model('Product', ProductSchema);
