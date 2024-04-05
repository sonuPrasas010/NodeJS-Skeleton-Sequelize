const express = require('express');
const router = express.Router();

const authController = require('../../controllers/api/auth');
const { check } = require('express-validator');
const { authenticateJWT } = require('../../middlewares/auth_middleware')
const multer = require('multer');
const {addProduct, addColor, deleteProduct, deleteColor, updateProduct, updateColor, getAllProducts, getSingleProduct}  = require('../../controllers/admin/product_controller');
const Product = require('../../model/product');
const { Op } = require('sequelize');
const Category = require('../../model/category');
const { adminCategoryRoute } = require('./category_route');
const { adminProductRoute } = require('./product_route');


router.post('/google-login', authController.googleLogin)
router.all('/email-login', [
    check('email').isEmail().trim(),
    check('password').isLength({ min: 5 }),
], authController.emailLogin),

router.all('/change-password', [
    check('password').isLength({ min: 5 }),
    check('newPassword').isLength({min: 5}),
    check('confirmPassword').isLength({min: 5}),
], authController.changePassword);

router.use("/categories",adminCategoryRoute);
router.use("/products", adminProductRoute);









module.exports = router;