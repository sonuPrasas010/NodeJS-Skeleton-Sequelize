const { DataTypes } = require("sequelize");
const sequelize = require("../db_config");


/**
 * Represents a color in the Product.
 *
 * @typedef {Object} Color
 * @property {string} colorName - The name of the color.
 * @property {string} colorCode - The hexadecimal code representing the color.
 */

/**
 * @class
 * @classdesc Represents a color entity in the database.
 */
const Color = sequelize.define("Color", {
    /**
     * @member {string}
     * @description The name of the color.
     * @required
     */
    colorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    /**
     * @member {string}
     * @description The hexadecimal code representing the color.
     * @required
     */
    colorCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    /**
     * @member {string}
     * @description The hexadecimal code representing the color.
     * @required
     */
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  
  /**
   * @module Color
   */
  module.exports = Color;
  