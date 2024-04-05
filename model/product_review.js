const sequalize = require("../db_config");
const {DataTypes} = require("sequelize")

const ProductReview = sequalize.define("product_review",{
    review :{
        type: DataTypes.STRING,
    },
    rating: {
        type: DataTypes.DECIMAL(2),
        allowNull: false,
    }
});

module.exports = ProductReview;