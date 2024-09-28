const Product = require('../../models/Product');
const Review = require('../../models/Review');

const mongoose = require('mongoose');
const multiparty = require('multiparty');

class ProductController {

    // product  add ,edit, Delete, get, getById

    async createProduct(req, res) {
        const { name, description, isInStock, gender, category, availableSizes, rating,
            productionDate, price, brandName, productCode, productImage
            //   imageUrl, additionalImageUrls
        } = req.body;
        // const productImage = req.file ? `/uploads/${req.file.filename}` : '';

        try {
            const newProduct = new Product({
                name,
                description,
                isInStock,
                gender,
                category,
                availableSizes: JSON.parse(availableSizes), // Parse JSON string
                rating,
                // reviews: JSON.parse(reviews), // Parse JSON string
                // totalReviewCount,
                productionDate,
                price: JSON.parse(price), // Parse JSON string
                brandName,
                productCode,
                // imageUrl,
                // additionalImageUrls: JSON.parse(additionalImageUrls), // Parse JSON string
                productImage
            });

            const product = await newProduct.save();
            res.json({ product, message: "Product Add successfully", success: true });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }


    async updateProduct(req, res) {
        const { name, description, isInStock, gender, category, availableSizes, rating, reviews, totalReviewCount, productionDate, price, brandName, productCode, imageUrl, additionalImageUrls } = req.body;

        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (description) updatedFields.description = description;
        if (isInStock !== undefined) updatedFields.isInStock = isInStock;
        if (gender) updatedFields.gender = gender;
        if (category) updatedFields.category = category;
        if (availableSizes) updatedFields.availableSizes = JSON.parse(availableSizes); // Parse JSON string
        if (rating !== undefined) updatedFields.rating = rating;
        if (reviews) updatedFields.reviews = JSON.parse(reviews); // Parse JSON string
        if (totalReviewCount !== undefined) updatedFields.totalReviewCount = totalReviewCount;
        if (productionDate) updatedFields.productionDate = productionDate;
        if (price) updatedFields.price = JSON.parse(price); // Parse JSON string
        if (brandName) updatedFields.brandName = brandName;
        if (productCode !== undefined) updatedFields.productCode = productCode;
        if (imageUrl) updatedFields.imageUrl = imageUrl;
        if (additionalImageUrls) updatedFields.additionalImageUrls = JSON.parse(additionalImageUrls); // Parse JSON string
        if (req.file) updatedFields.productImage = `/uploads/${req.file.filename}`;

        try {
            let product = await Product.findById(req.params.id);
            if (!product) return res.status(404).json({ msg: 'Product not found' });

            product = await Product.findByIdAndUpdate(
                req.params.id,
                { $set: updatedFields },
                { new: true }
            );

            res.json(product);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }

    async findAll(req, res) {
        try {
            const products = await Product.find();
            res.status(200).json({ products, message: "Products List successful", success: true });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }

    async findById(req, res) {
        const productId = req.params.productId;
        console.log('Fetching product with ID:', productId);

        try {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found", success: false });
            }

            const reviews = await Review.find({ productId });
            const totalReviewCount = await Review.countDocuments({ productId });

            const productWithReviews = product.toObject();
            productWithReviews.reviews = reviews;

            console.log('Product fetched:', productWithReviews);
            res.status(200).json({ product: productWithReviews, totalReviewCount, message: "Product fetched successfully", success: true });
        } catch (err) {
            console.error('Error fetching product:', err.message);
            res.status(500).send('Server error');
        }
    }

    // Review  add ,edit, Delete, get, getById

    async createReview(req, res) {
        console.log(req.body, '=+++++++++++++++++++++++++++++')
        const { productId, username, userImage, location, rating, date, reviewTitle, reviewText } = req.body;

        try {
            const newReview = new Review({ productId, username, userImage, location, rating, date, reviewTitle, reviewText });
            const review = await newReview.save();
            res.status(201).json({ review, message: "Review added successfully", success: true });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }

    async updateReview(req, res) {
        const { username, userImage, location, rating, date, reviewTitle, reviewText } = req.body;
        const updatedFields = { username, userImage, location, rating, date, reviewTitle, reviewText };

        try {
            let review = await Review.findById(req.params.id);
            if (!review) return res.status(404).json({ message: "Review not found", success: false });

            review = await Review.findByIdAndUpdate(
                req.params.id,
                { $set: updatedFields },
                { new: true }
            );

            res.status(200).json({ review, message: "Review updated successfully", success: true });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }

    async reviewList(req, res) {
        try {
            const reviews = await Review.find({ productId: req.params.productId });
            const totalReviewCount = await Review.countDocuments({ productId: req.params.productId });
            res.status(200).json({ reviews, totalReviewCount, message: "Reviews listed successfully", success: true });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }

}

module.exports = new ProductController();