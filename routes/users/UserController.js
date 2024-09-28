const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const WishlistItem = require('../../models/WishlistItem');
const jwt = require('jsonwebtoken');
const config = require('../../config');

class UserController {
    //User Login
    async createUser(req, res) {
        const { id, name, lastname, email, phone, adress, password, role } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }
            console.log(id, name, lastname, email, phone, adress, password, role, '==========')
            user = new User({ id, name, lastname, email, phone, adress, password, role });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            const payload = { user: { id: user.id } };
            jwt.sign(payload, config.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }

    async loginUser(req, res) {
        const { email, password } = req.body;
        console.log('req.body==>', req.body)
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid email' });
            }
            console.log('user==>', user)
            // const isMatch = User.findById(req?.user?.id).select('-password');
            // // const isMatch = await bcrypt.compare(password, user.password);
            // console.log('isMatch==>,',isMatch)
            // if (!isMatch) {
            //     return res.status(400).json({ msg: 'Invalid password' });
            // }
            // console.log('user===1>',user)
            // console.log(email,password,user,'===++++++++++++++++')
            const payload = { user: { id: user.id } };
            jwt.sign(payload, config.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                if (err) throw err;

                res.status(200).json({ token, user, message: "Login successful", "success": true, });
                console.log('You are Login Now++++++++++++++++++=')
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }

    // User Profile 
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }

    async updateProfile(req, res) {
        console.log('Received fields:', req.body);
        console.log('Received file:', req.file);
        const { name, email, password } = req.body;

        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (email) updatedFields.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedFields.password = await bcrypt.hash(password, salt);
        }
        if (req.file) updatedFields.profileImage = `/uploads/${req.file.filename}`;

        try {
            let user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: 'User not found' });

            user = await User.findByIdAndUpdate(
                req.user.id,
                { $set: updatedFields },
                { new: true }
            ).select('-password');

            res.json(user);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }

    //User wishlist 
    async addwishlist(req, res) {
        const { userId, title, image, rating, price, brandName, amount, selectedSize, isInWishList } = req.body;

        try {
            const newWishlistItem = new WishlistItem({
                userId,
                title,
                image,
                rating,
                price,
                brandName,
                amount,
                selectedSize,
                isInWishList
            });
            console.log(newWishlistItem, '+++++++++++++++')
            const wishlistItem = await newWishlistItem.save();
            res.status(201).json({ wishlistItem, message: "Item added to wishlist successfully", success: true });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }

    async editwishlist(req, res) {
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
    }

    async getwishlist(req, res) {
        try {
            const wishlistItems = await WishlistItem.find({ userId: req.params.userId  });
            const totalWishlistCount = await WishlistItem.countDocuments({ userId: req.params.userId });
            res.status(200).json({ wishlistItems, totalWishlistCount, message: "Wishlist items listed successfully", success: true });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }

    async removewishlist(req, res) {
        try {
            let wishlistItem = await WishlistItem.findById(req.params.id);
            if (!wishlistItem) return res.status(404).json({ message: "Wishlist item not found", success: false });

            console.log(wishlistItem, '++++++++++++')
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
    }
}

module.exports = new UserController();
