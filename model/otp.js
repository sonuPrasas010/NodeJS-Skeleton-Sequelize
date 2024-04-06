const sequelize = require("../db_config");
const { DataTypes } = require('sequelize');

const OTP = sequelize.define("OTP", {
    otp: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    }
});

module.exports = OTP;