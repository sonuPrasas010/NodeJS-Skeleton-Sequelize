const express = require('express');
const { updateProduct, deleteProduct, addProduct, getAllProducts, getSingleProduct, addColor, deleteColor, updateColor } = require('../../controllers/admin/product_controller');
const multer = require('multer');
const { check } = require('express-validator');
const router = express.Router();

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/'); // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
      cb(null,Date.now() + '-' + file.originalname); // Rename the file to include the timestamp
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


router.get("/", getAllProducts);
router.get("/:productId", getSingleProduct);
router.delete('/:productId',deleteProduct);


router.post('/product/add',
upload.single("image"),
[
    check('name').notEmpty().withMessage('Name is required'),
    check('description').notEmpty().withMessage('Description is required').trim(),
    check('price').isInt({min: 0}).withMessage('Price must be greater than 0'),
    check('sizes').isArray().withMessage('Sizes must be an array'),
    check('slug').notEmpty().withMessage('Slug is required').trim().custom(async(input)=>{
       const count = await Product.count({where: {slug: input} });
        if (count > 0) {
            return Promise.reject(new Error("Slug already exists"));
        }
        return true;
    }),
    check('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    check('deliveryCharge').isFloat({ min: 0 }).withMessage('Delivery charge must be a non-negative number'),
    check('discount').isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
], 

addProduct);


router.put('/:productId',
upload.single("image"),
[
    check('name').notEmpty().withMessage('Name is required'),
    check('description').notEmpty().withMessage('Description is required').trim(),
    check('price').isInt({min: 0}).withMessage('Price must be greater than 0'),
    check('sizes').isArray().withMessage('Sizes must be an array'),
    check('slug').notEmpty().withMessage('Slug is required').trim().custom(async(input, {req})=>{
        const count = await Product.count({
            where: {
              slug: input,
              id: {
                [Op.ne]: req.params.productId, // Exclude the current product ID
              },
            },
          });
        if (count > 0) {
            return Promise.reject(new Error("Slug already exists"));
        }
        return true;
    }),
    check('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    check('deliveryCharge').isFloat({ min: 0 }).withMessage('Delivery charge must be a non-negative number'),
    check('discount').isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
    check("categories").isArray().withMessage("Must be an array of category id"),
    check("removedCategories").isArray().withMessage("Must be an array"),
], 
updateProduct);


// product color route
router.post('/add-color/:productId',
upload.single('image'),
[
    check('colorCode').notEmpty().withMessage('Color code is required'),
    check('colorName').notEmpty().withMessage('Color name is required'),
    check("image").notEmpty(),
], 
addColor);

router.put('/product/update-color/:colorId',
  upload.single("image"),
  [
    check('colorCode').notEmpty().withMessage('Color code is required'),
    check('colorName').notEmpty().withMessage('Color name is required'),
  ],
  updateColor
);

router.delete('/product/destroy-color/:colorId',deleteColor);

module.exports.adminProductRoute = router;