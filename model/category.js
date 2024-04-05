const { DataTypes } = require("sequelize");
const sequelize = require("../db_config");

/**
 * Represents a Category (including Subcategories).
 *
 * @typedef {Object} CategoryAttributes
 * @property {string} name - The name of the category or subcategory.
 * @property {string} description - The description of the category or subcategory.
 * @property {number} parentId - The ID of the parent category for subcategories.
 */

/**
 * @class
 * @classdesc Represents a Category entity in the database.
 */
const Category = sequelize.define("Category", {
  /**
   * @member {string}
   * @description The name of the category or subcategory.
   * @required
   */
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  /**
   * @member {string}
   * @description The description of the category or subcategory.
   */
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  /**
   * @member {string}
   * @description The slug of the category or subcategory.
   */
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Category;
