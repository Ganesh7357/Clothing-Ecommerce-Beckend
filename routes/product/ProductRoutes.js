const express = require('express')
const router = express.Router();
const ProductController = require('./ProductController')
const upload = require('../../middleware/upload');
const authMiddleware = require('../../middleware/authMiddleware');


router.post('/addProduct', authMiddleware, upload.single('productImage'), ProductController.createProduct);
router.put('/edit/:id',authMiddleware, ProductController.updateProduct);
router.get('/getProduct', ProductController.findAll);
router.get('/:productId', ProductController.findById);
router.post('/add', ProductController.createReview);
router.put('/edit/:id', ProductController.updateReview);
router.get('/list/:productId', ProductController.reviewList);


module.exports = router; 