const sequalize = require("../db_config");
const { DataTypes } = require('sequelize');

const ProductOrder = sequalize.define("ProductOrder", {

    totalCost: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    paymentStatus: {
        type: DataTypes.ENUM(["paid", "unpaid"]),
        defaultValue: "unpaid",
    },
    paymentMethod: {
        type: DataTypes.ENUM(["online", "on_delivery"]),
        defaultValue: "on_delivery"
    },
    orderStatus: {
        type: DataTypes.ENUM(['pending', "confirmed", "delivered", "cancelled"]),
        defaultValue: "pending",
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
    },
    phoneNumber: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    shippingStreetAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    billingCity: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    billingState: {
        type: DataTypes.STRING,
        allowNull: true,
    }

})

module.exports = ProductOrder;