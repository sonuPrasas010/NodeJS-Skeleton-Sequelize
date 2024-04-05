const express = require('express');
const router = express.Router();

const authController = require('../../controllers/api/auth');
const productController = require("../../controllers/api/product_controller")
const { check } = require('express-validator');
const { authenticateOptionalJWTForUser, authenticateJWTForUser } = require('../../middlewares/auth_middleware')
const helper = require("../../helpers/helper");
const favrouiteRoute = require("../../routes/api/fav_route")
const productReviewRoute = require("../../routes/api/product_review_route")

router.post('/google-login', authController.googleLogin)
router.all('/email-login', [
  check('email').isEmail().trim(),
  check('password').isLength({ min: 5 }),
], authController.emailLogin)

router.post('/register', [
  check('email').isEmail().trim(),
  check('password').isLength({ min: 5 }),
  check('name').notEmpty().trim(),
], authController.register)

router.patch('/change-password', [
  check('password').isLength({ min: 5 }),
  check('newPassword').isLength({ min: 5 }),
  check('confirmPassword').isLength({ min: 5 }),
], authController.changePassword)

router.patch('/update-profile', authenticateJWTForUser, [check('name').notEmpty().trim()], helper.upload.single('image'), authController.changeProfile);

router.post("/upload-image",helper.upload.single("image"), productController.uploadImageForTest);

router.use("/favorite", favrouiteRoute);

router.use("/product-review", productReviewRoute);



module.exports = router; 