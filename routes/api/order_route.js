const express = require('express');
const { authenticateJWTForUser } = require('../../middlewares/auth_middleware');
const orderController = require('../../controllers/api/product_order_controller');
const { body, param } = require('express-validator');
const ProductOrder = require('../../model/product_order');
const router = express.Router();

router.get("/get", authenticateJWTForUser, orderController.getAllOrders);

router.put("/make", authenticateJWTForUser, [
    body("paymentMethod").isIn(["paid", "unpaid"]),
    body("paymentMethod").isIn(["online", "on_delivery"]),
    body("orderStatus").isIn(['pending', "confirmed", "delivered", "cancelled"]),
    body("email").isEmail().trim(),
    body("phoneNumber").notEmpty().trim(),
    body("shippingStreetAddress").trim().notEmpty(),
    body("billingCity").trim().notEmpty(),
    body("billingState").trim().notEmpty(),
    body('totalCost').notEmpty(),

], orderController.makeOrder);

router.post("/cancel/:orderId", authenticateJWTForUser, [
    param('orderId').custom(async (orderId, meta) => {
        const order = await ProductOrder.findByPk(orderId)
        if (!order) throw Error("unknown order")
    })
], orderController.cancelOrder);

module.exports = router;