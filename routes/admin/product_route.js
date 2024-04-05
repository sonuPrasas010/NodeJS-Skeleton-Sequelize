const express = require('express');
const { updateProduct, deleteProduct, addProduct, getAllProducts, getSingleProduct, addColor, deleteColor, updateColor } = require('../../controllers/admin/product_controller');
const { check } = require('express-validator');
const router = express.Router();
const helper = require("../../helpers/helper")
const {Op} = require("sequelize");
// Initialize Multer with the storage configuration


router.get("/", getAllProducts);
router.get("/:productId", getSingleProduct);
router.delete('/:productId', deleteProduct);


router.put('/product/add',
  helper.upload.single("image"),
  [
    check('name').notEmpty().withMessage('Name is required'),
    check('description').notEmpty().withMessage('Description is required').trim(),
    check('price').isInt({ min: 0 }).withMessage('Price must be greater than 0'),
    check('sizes').isArray().withMessage('Sizes must be an array'),
    check('slug').notEmpty().withMessage('Slug is required').trim().custom(async (input) => {
      const count = await Product.count({ where: { slug: input } });
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


router.patch('/:productId',
  helper.upload.single("image"),
  [
    check('name').notEmpty().withMessage('Name is required'),
    check('description').notEmpty().withMessage('Description is required').trim(),
    check('price').isInt({ min: 0 }).withMessage('Price must be greater than 0'),
    check('sizes').isArray().withMessage('Sizes must be an array'),
    check('slug').notEmpty().withMessage('Slug is required').trim().custom(async (input, { req }) => {
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





module.exports.adminProductRoute = router;