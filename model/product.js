const { DataTypes } = require('sequelize');
const sequelize = require('../db_config'); // Replace 'your_sequelize_instance' with your actual Sequelize instance
/**
 * @typedef {Object} ProductAttributes
 * @property {string} name - The name of the product.
 * @property {string} description - The description of the product.
 * @property {string} colors - JSON string representing color variants available for the product.
 * @property {string} sizes - JSON string representing size variants available for the product.
 * @property {string} image - The URL or path to the product image.
 * @property {string} slug - A unique identifier for the product (usually a URL-friendly string).
 * @property {number} stock - The current stock quantity of the product.
 * @property {number} deliveryCharge - The delivery charge for the product.
 * @property {number} discount - The discount percentage for the product.
 */

/**
 * @typedef {import('sequelize').Model<ProductAttributes>} ProductModel
 */

/**
 * Product model definition
 * @type {import('sequelize').ModelDefined<ProductModel, ProductAttributes>}
 */
const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The name of the product.',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'The description of the product.',
    },
    price: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'The pice of a product.',
    },
    sizes: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'JSON string representing size variants available for the product.',
      get() {
        return JSON.parse(this.getDataValue('sizes'));
      },
      set(value) {
        this.setDataValue('sizes', JSON.stringify(value));
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The URL or path to the product image.',
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'A unique identifier for the product (usually a URL-friendly string).',
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'The current stock quantity of the product.',
    },
    deliveryCharge: {
      type: DataTypes.DECIMAL(10, 2),
      comment: 'The delivery charge for the product.',
    },
    discount: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'The discount percentage for the product.',
    },
  });
  
  module.exports = Product;