/**
 * @module Favorite
 * @requires sequelize
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../db_config');

/**
 * Represents a favorite relationship between a user and a product.
 * @class
 * @augments Model
 */
const Favorite = sequelize.define('Favorite', {
  /**
   * @property {DataTypes.BIGINT.UNSIGNED} id - The primary key of the favorite relationship, auto-incremented.
   */
  id: {
    primaryKey: true,
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true
  },
});

module.exports = Favorite;
