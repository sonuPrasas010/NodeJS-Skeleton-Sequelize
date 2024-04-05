const express = require('express');
const router = express.Router();

const authController = require('../../controllers/admin/auth');
const { check } = require('express-validator');
const { authenticateJWT, authenticateJWTForAdmin } = require('../../middlewares/auth_middleware')
const multer = require('multer');
const { addProduct, addColor, deleteProduct, deleteColor, updateProduct, updateColor, getAllProducts, getSingleProduct } = require('../../controllers/admin/product_controller');
const Product = require('../../model/product');
const { Op } = require('sequelize');
const Category = require('../../model/category');
const { adminCategoryRoute } = require('./category_route');
const { adminProductRoute } = require('./product_route');


router.all('/email-login', [
    check('email').isEmail().trim(),
    check('password').isLength({ min: 5 }),
], authController.emailLoginAdmin);

router.all('/change-password', authenticateJWTForAdmin, [
    check('password').isLength({ min: 5 }),
    check('newPassword').isLength({ min: 5 }),
    check('confirmPassword').isLength({ min: 5 }),
], authController.changePassword);

router.use("/categories", authenticateJWTForAdmin, adminCategoryRoute);
router.use("/products", authenticateJWTForAdmin, adminProductRoute);









module.exports = router;