const { body } = require('express-validator');
const authController = require('../../controllers/api/auth');

const express = require("express");
const router = express.Router();

router.post('/google-login', authController.googleLogin)

router.all('/email-login', [
    check('email').isEmail().trim(),
    check('password').isLength({ min: 5 }),
], authController.emailLogin)

router.post('/register', [
    body('email').isEmail().trim(),
    body('password').isLength({ min: 5 }),
    body('name').notEmpty().trim(),
], authController.register)

router.post('/change-password', [
    body('password').isLength({ min: 5 }),
    body('newPassword').isLength({ min: 5 }),
    body('confirmPassword').isLength({ min: 5 }),
], authController.changePassword)

module.exports = router;