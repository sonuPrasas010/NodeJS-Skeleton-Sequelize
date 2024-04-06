const express = require('express');
const router = express.Router();

const productController = require("../../controllers/api/product_controller")
const { check } = require('express-validator');
const { authenticateOptionalJWTForUser, authenticateJWTForUser } = require('../../middlewares/auth_middleware')
const helper = require("../../helpers/helper");
const favrouiteRoute = require("./fav_route")
const orderRoute = require("./order_route")
const productReviewRoute = require("./product_review_route")
const authRoute = require("../../routes/api/auth_route")


router.use("/", authRoute);

router.patch('/update-profile', authenticateJWTForUser, [check('name').notEmpty().trim()], helper.upload.single('image'), authController.changeProfile);

router.post("/upload-image",helper.upload.single("image"), productController.uploadImageForTest);

router.use("/favorite", favrouiteRoute);

router.use("/product-review", productReviewRoute);

router.use("/order", orderRoute)



module.exports = router; 