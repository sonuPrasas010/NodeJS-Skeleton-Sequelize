const sequelize = require("../db_config");
const { DataTypes } = require('sequelize');

const ProductOrderItems = sequelize.define("ProductOrderItems", {
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    discount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
});

module.exports = ProductOrderItems;