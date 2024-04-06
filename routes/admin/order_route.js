const express = require('express');
const { authenticateJWTForUser } = require('../../middlewares/auth_middleware');
const orderController = require('../../controllers/admin/product_order_controller');
const { body, param } = require('express-validator');
const ProductOrder = require('../../model/product_order');
const router = express.Router();

router.get("/get", orderController.getAllOrders);


router.put("/change-status/:orderId", [
    param('orderId').custom(async (orderId, meta) => {
        const order = await ProductOrder.findByPk(orderId)
        if (!order) throw Error("unknown order")
    }),
    body("orderStatus").isIn(['pending', "confirmed", "delivered", "cancelled"]),
    body("paymentStatus").isIn(['paid', "unpaid"]),
], orderController.changeOrderStatus);

module.exports.adminOrderRoute = router;