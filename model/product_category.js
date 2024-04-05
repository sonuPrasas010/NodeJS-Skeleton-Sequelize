const { DataTypes } = require("sequelize");
const sequelize = require("../db_config");

/**
 * @class
 * @classdesc Represents the join table for the many-to-many relationship between Product and Category.
 */
const ProductCategory = sequelize.define("ProductCategory");

  module.exports = ProductCategory;