const { body } = require('express-validator');
const authController = require('../../controllers/api/auth_controller');

const express = require("express");
const User = require('../../model/users');
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

router.post("/reset-password", [
    body("email").trim().isEmail().custom(async (input) => {
        const user = await User.findOne({ email: input });
        if (!user) throw Error("User does not exist in database")
    }),
    body("nowPassword").isStrongPassword({ minLength: 6 }),
    body("confirmPassword").equals(body("newPassword")),
    body("otpCode").length(4),
], authController.resetPassword);

module.exports = router;