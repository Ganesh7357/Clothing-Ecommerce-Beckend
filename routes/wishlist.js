const express = require('express');
const WishlistItem = require('../models/WishlistItem');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Add item to wishlist

router.post('/add', authMiddleware, async (req, res) => {
    const {userId, title, image, rating, price, brandName, amount, selectedSize,isInWishList } = req.body;

    try {
        const newWishlistItem = new WishlistItem({
            userId,
            title,
            image,
            rating,
            price,
            brandName,
            amount,
            selectedSize
        });

        const wishlistItem = await newWishlistItem.save();
        res.status(201).json({ wishlistItem, message: "Item added to wishlist successfully", success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Edit item in wishlist
router.put('/edit/:id', authMiddleware, async (req, res) => {
    const { title, image, rating, price, brandName, amount, selectedSize, isInWishList } = req.body;
    const updatedFields = { title, image, rating, price, brandName, amount, selectedSize, isInWishList };

    try {
        let wishlistItem = await WishlistItem.findById(req.params.id);
        if (!wishlistItem) return res.status(404).json({ message: "Wishlist item not found", success: false });

        // Ensure the wishlist item belongs to the authenticated user
        if (wishlistItem.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }

        wishlistItem = await WishlistItem.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );

        res.status(200).json({ wishlistItem, message: "Wishlist item updated successfully", success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// List items in user's wishlist
router.get('/list/:userId', authMiddleware, async (req, res) => {
    try {
        const wishlistItems = await WishlistItem.find({ userId: req.params.userId });
        const totalWishlistCount = await WishlistItem.countDocuments({ userId: req.params.userId });
        res.status(200).json({ wishlistItems,totalWishlistCount, message: "Wishlist items listed successfully", success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Remove item from wishlist
router.delete('/remove/:id', authMiddleware, async (req, res) => {
    try {
        let wishlistItem = await WishlistItem.findById(req.params.id);
        if (!wishlistItem) return res.status(404).json({ message: "Wishlist item not found", success: false });

        // Ensure the wishlist item belongs to the authenticated user
        // if (wishlistItem.userId.toString() !== req.user.id) {
        //     return res.status(401).json({ message: "Unauthorized", success: false });
        // }

        await WishlistItem.findByIdAndRemove(req.params.id);

        res.status(200).json({ message: "Wishlist item removed successfully", success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
