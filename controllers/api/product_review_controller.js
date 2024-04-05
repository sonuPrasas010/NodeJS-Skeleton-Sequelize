const { validationResult } = require('express-validator');
const { sendGoodResponse, sendBadResponse } = require('../../helpers/helper');
const Product = require('../../model/product');
const ProductReview = require('../../model/product_review');

/**
 * Add a new review
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports.addReview = async (req, res) => {
  try {
    const user = req.user;
    const { productId } = req.params;
    const { rating, reviewText } = req.body;


    // Create the review
    const newReview = await ProductReview.create({
      productId: productId,
      userId: user.id,
      rating: rating,
      reviewText
    });

    return sendGoodResponse(res, { msg: "successfully added review", data: newReview });
  } catch (error) {
    return sendBadResponse(res, { msg: "server error" }, 500);
  }
};

/**
 * Edit an existing review
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports.editReview = async (req, res) => {
  try {
    const user = req.user;
    const { reviewId } = req.params;
    const { rating, review } = req.body;

    const productReview = await ProductReview.findByPk(reviewId)
    // Update the review
    productReview.rating = parseFloat(rating);
    productReview.review = review;
    await productReview.save();

    sendGoodResponse(res, { msg: "successfully edited product review", productReview });
  } catch (error) {
    sendBadResponse(res, { success: false, error: error.message }, 500);
  }
};

/**
 * Get reviews for a product
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports.getReviews = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return sendBadResponse(res, { msg: "validation error", error: result.array({ onlyFirstError: true }) });
  }
  try {
    const { productId } = req.params;

    // Find all reviews for the product
    const reviews = await ProductReview.findAll({ where: { productId: productId } });

    return sendGoodResponse(res, { msg: "successfully fetched revew", data: reviews },);
  } catch (error) {
    return sendBadResponse(res, { msg: "server error" }, 500)
  }
};

/**
 * Delete a review
 * @param {import("express").Request} req 
 * @param {import("express").Request} res 
 */
module.exports.destroyReview = async (req, res) => {
  try {
    const user = req.user;
    const { reviewId } = req.params;

    // Find the review
    const review = await ProductReview.findByPk(reviewId);
    await review.destroy();

    sendGoodResponse(res, { message: "Review deleted successfully" });
  } catch (error) {
    sendBadResponse(res, { message: "server error" }, 500);
  }
};
