/**
 * @module User
 * @requires sequelize
 * @requires config/config
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../db_config");

/**
 * @classdesc User is a model representing a table in the database.
 * It represents the users in a database.
 * @class
 * @augments Model
 * 
 * The properties in the `User` class are:
 * 
- **id**: The primary key of the table, auto-incremented.
- **name**: The name of the user. It is a string and cannot be null.
- **email**: The email of the user. It is a string, cannot be null, and must be unique.
- **image**: The image of the user. It is a string and can be null.
- **role**: The role of the user. It is a enum and can be admin, user.
*/
const User = sequelize.define("user", {
  /**
   * @property {DataTypes.BIGINT.UNSIGNED} id - The primary key of the table, auto-incremented.
   */
  id: {
    primaryKey: true,
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true
  },
  /**
   * @property {DataTypes.STRING} name - The name of the user. It is a string and cannot be null.
   */
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  /**
   * @property {DataTypes.STRING} email - The email of the user. It is a string, cannot be null, and must be unique.
   */
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  /**
   * @property {DataTypes.STRING} image - The image of the user. It is a string and can be null.
   */
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
   /**
   * @property {DataTypes.ENUM} role - The image of the user. It is a string and can be null.
   */
   role: {
    type: DataTypes.ENUM(["admin", "user"]),
    allowNull: true
  },
});

module.exports = User;
