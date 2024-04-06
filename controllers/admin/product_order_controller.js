const { validationResult } = require("express-validator");
const sequelize = require("../../db_config");
const { sendBadResponse, sendGoodResponse } = require("../../helpers/helper");
const ProductOrder = require("../../model/product_order");
const ProductOrderItems = require("../../model/product_order_items");
const Product = require("../../model/product");
const User = require("../../model/users");

const getAllOrders = async (req, res) => {
    try {
        let orders = await ProductOrder.findAll({ include: { include: [{ model: ProductOrderItems }, { model: User }] } });
        return sendGoodResponse(res, { msg: "data fetched successfuly", data: orders });
    } catch (error) {
        return sendBadResponse(res, { error: error.message }, 500);
    }
};



/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns 
 */
const changeOrderStatus = async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return sendBadResponse(res, { msg: "validation failed", data: result.array({ onlyFirstError: true }) }, 400);
    }

    const userId = req.user.id; // Access user ID from req.user
    const orderId = req.params.orderId;
    const {orderStatus, paymentStatus} = req.body;

    try {
        // Check if the order exists and belongs to the user
        const order = await ProductOrder.findOne({ where: { id: orderId, userId } });
        if (!order) {
            return sendBadResponse(res, { message: 'unauthorized' });
        }

        // Delete the order and associated items
        order.set("orderStatus", orderStatus);
        order.set("paymentStatus", paymentStatus);
        await order.save();

        return sendGoodResponse(res, { success: true, message: 'Order updated successfully' });
    } catch (error) {
        return sendBadResponse(res, { error: error.message }, 500);
    }
};

module.exports = { getAllOrders, changeOrderStatus };
