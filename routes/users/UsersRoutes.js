const express = require('express')
const router = express.Router();
const userController = require('./UserController');
const upload = require('../../middleware/upload');
const authMiddleware = require('../../middleware/authMiddleware');


router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/getProfile', userController.getProfile);
router.put('/edit', userController.updateProfile);

router.post('/wishlistAdd', userController.addwishlist);
router.put('/edit/:id', userController.editwishlist);
router.get('/list/:userId', userController.getwishlist);
router.delete('/remove/:id', userController.removewishlist);





module.exports = router; 