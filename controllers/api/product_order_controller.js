const { validationResult } = require("express-validator");
const sequelize = require("../../db_config");
const { sendBadResponse, sendGoodResponse } = require("../../helpers/helper");
const ProductOrder = require("../../model/product_order");
const ProductOrderItems = require("../../model/product_order_items");
const Product = require("../../model/product");

const getAllOrders = async (req, res) => {
    const userId = req.user.id; // Access user ID from req.user
    try {
        let orders = await ProductOrder.findAll({ where: { userId }, include: ProductOrderItems });
        return res.json({ success: true, data: orders });
    } catch (error) {
        return sendBadResponse(res, { error: error.message }, 500);
    }
};

const makeOrder = async (req, res) => {
    const userId = req.user.id; // Access user ID from req.user
    const { total_cost, paymentMethod, email, phone_number, shipping_street_address, billing_city, billing_state, items } = req.body;
    const transaction = await sequelize.transaction();

    try {
        const newOrder = await ProductOrder.create({
            total_cost,
            paymentMethod,
            email,
            phone_number,
            shipping_street_address,
            billing_city,
            billing_state,
            userId
        }, { transaction });

        let totalCost = 0;
        items.map(async (item) => {
            const { quantity, productId } = item;
            const product = await Product.findByPk(productId);
            const discount = product.discount;
            const price = product.price * quantity;
            const totalDiscount = price * discount / 100;

            totalCost = totalCost + price - totalDiscount;

            ProductOrderItems.create({
                price: price,
                discount: totalDiscount,
                quantity: quantity,
                ProductOrderId: newOrder.id // Associate order item with the new order
            }, { transaction });

        })
        newOrder.set("totalCost", totalCost);
        await newOrder.save({transaction});

        await transaction.commit();
        return sendGoodResponse(res, { success: true, message: 'Order placed successfully' });
    } catch (error) {
        await transaction.rollback();
        return sendBadResponse(res, { msg: 'server error' }, 500);
    }
};

const cancelOrder = async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return sendBadResponse(res, { msg: "validation failed", data: result.array({ onlyFirstError: true }) }, 400);
    }

    const userId = req.user.id; // Access user ID from req.user
    const orderId = req.params.orderId;

    try {
        // Check if the order exists and belongs to the user
        const order = await ProductOrder.findOne({ where: { id: orderId, userId } });
        if (!order) {
            return sendBadResponse(res, { message: 'unauthorized' });
        }

        // Delete the order and associated items
        order.orderStatus = "cancelled";
        await order.update();

        return sendGoodResponse(res, { success: true, message: 'Order canceled successfully' });
    } catch (error) {
        return sendBadResponse(res, { error: error.message }, 500);
    }
};

module.exports = { getAllOrders, makeOrder, cancelOrder };
