const express = require('express');
const router = express.Router();

const authController = require('../../controllers/api/auth');
const { check } = require('express-validator');
const { authenticateOptionalJWTForUser } = require('../../middlewares/auth_middleware')
const multer = require('multer');

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Rename the file to include the timestamp
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File must be an image'), false);
  }
};

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/google-login', authController.googleLogin)
router.all('/email-login', [
  check('email').isEmail().trim(),
  check('password').isLength({ min: 5 }),
], authController.emailLogin)

router.post('/register', [
  check('email').isEmail().trim(),
  check('password').isLength({ min: 5 }),
  check('name').notEmpty().trim(),
], authController.register)

router.patch('/change-password', [
  check('password').isLength({ min: 5 }),
  check('newPassword').isLength({ min: 5 }),
  check('confirmPassword').isLength({ min: 5 }),
], authController.changePassword)

router.patch('/update-profile', authenticateOptionalJWTForUser, [check('name').notEmpty().trim()], upload.single('image'), authController.changeProfile);




module.exports = router; 