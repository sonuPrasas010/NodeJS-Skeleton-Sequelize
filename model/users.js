/**
 * @module User
 * @requires sequelize
 * @requires config/config
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../db_config");
const { hashSync } = require("bcrypt");

/**
 * @classdesc User is a model representing a table in the database.
 * It represents the users in a database.
 * @class
 * @augments Model
 * 
 * The properties in the `User` class are:
 * 
 * - **id**: The primary key of the table, auto-incremented.
 * - **name**: The name of the user. It is a string and cannot be null.
 * - **email**: The email of the user. It is a string, cannot be null, and must be unique.
 * - **password**: The password of the user. It is a string, cannot be null but only for social login.
 * - **address**: The address of the user. It is a string and can be null.
 * - **phone**: The phone number of the user. It is a string and can be null.
 * - **image**: The image of the user. It is a string and can be null.
 * - **role**: The role of the user. It is an enum and can be 'admin' or 'user'.
 */
const User = sequelize.define("user", {
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
   * @property {DataTypes.STRING} password - The password of the user. It is a string, cannot be null but only for social login.
   */
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
    set(value){
      if(value){
        this.setDataValue('password', hashSync(value, 10))
      }
    }
  },
  /**
   * @property {DataTypes.STRING} address - The address of the user. It is a string and can be null.
   */
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  /**
   * @property {DataTypes.STRING} phone - The phone number of the user. It is a string and can be null.
   */
  phone:{
    type: DataTypes.STRING,
    allowNull: true
  },
  /**
   * @property {DataTypes.STRING} image - The image of the user. It is a string and can be null.
   */
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  /**
   * @property {DataTypes.ENUM} role - The role of the user. It is an enum and can be 'admin' or 'user'.
   */
  role: {
    type: DataTypes.ENUM(["admin", "user"]),
    allowNull: true
  },
},
  {
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
  });

module.exports = User;
