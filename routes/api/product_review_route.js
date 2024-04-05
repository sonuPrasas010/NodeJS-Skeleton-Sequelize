const express = require("express");
const { authenticateOptionalJWTForUser, authenticateJWTForUser } = require("../../middlewares/auth_middleware");
const { addReview, getReviews, editReview, destroyReview } = require("../../controllers/api/product_review_controller");
const { check, param, body } = require("express-validator");
const Product = require("../../model/product");
const ProductReview = require("../../model/product_review");
const router = express.Router();

router.get("/:productId", authenticateOptionalJWTForUser, [
    param("productId").custom(async (value) => {
        let product = await Product.findByPk(value);
        if (!product) throw Error("No Product found");
    })
], getReviews);

router.put("/:productId", authenticateJWTForUser, [
    param("productId").custom(async (value) => {
        let product = await Product.findByPk(value);
        if (!product) throw Error("No Product found");
    })
], addReview);

router.patch("/:reviewId", authenticateJWTForUser, [
    param("productId").custom(async (value, meta) => {
        let review = await ProductReview.findOne({ where: { id: value, userId: meta.req.user.id } });
        if (!review) throw Error("No reviews found");
    }),
    body("review").trim(),
    body("rating").notEmpty().custom(value => {
        const checkValidation =  /^\d+(\.\d+)?$/.test(value); // Checks if it's a non-negative integer or decimal number
        if(!checkValidation) throw Error("invalid value"); 
    })
], editReview)

router.delete("/:reviewId", authenticateJWTForUser, [
    param("productId").custom(async (value, meta) => {
        let review = await ProductReview.findOne({ where: { id: value, userId: meta.req.user.id } });
        if (!review) throw Error("No reviews found");
    })
], destroyReview)



module.exports = router;