const { validationResult } = require('express-validator');
const Product = require('../../model/product'); // Adjust the path based on your project structure
const { sendGoodResponse, sendBadResponse, upload, moveTempFileToPermanentDestination } = require('../../helpers/helper');
const Category = require('../../model/category'); 

/**
 * 
 * @param {import('express').Request} req 
 * @param {*} res 
 * @returns 
 */
const addProduct = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "failed", errors: errors.array({ onlyFirstError: true }) });
  }

  try {
    const {
      name,
      description,
      colors,
      price,
      sizes,
      slug,
      stock,
      deliveryCharge,
      discount,
    } = req.body;
    console.log(req.file);
    const image = moveTempFileToPermanentDestination(req.file.path, req.file.filename, "public/images");

    const newProduct = await Product.create({
      name,
      description,
      colors,
      image,
      price,
      sizes,
      slug,
      stock,
      deliveryCharge,
      discount,
    });

    // for (const categoryId of req.body.categories) {
    //   newProduct.addCategory(categoryId);
    // }

    await newProduct.addCategories(req.body.categories);
    res.status(201).json({ success: true, product: await newProduct.reload({ include: Category }) });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

/**
 * Updates a product based on the provided product ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns
 */
const updateProduct = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendBadResponse(res, { status: "failed", errors: errors.array({ onlyFirstError: true }) })
    }

    const productId = req.params.productId;
    const existingProduct = await Product.findByPk(productId);
    if (!existingProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Update product fields based on the request body
    const {
      name,
      description,
      colors,
      price,
      sizes,
      slug,
      stock,
      deliveryCharge,
      discount,
    } = req.body;

    // If a new image is uploaded, update the image path
    const image = req.file ? moveTempFileToPermanentDestination(req.file.path, req.file.fieldname, "public/images") : existingProduct.image;

    // Update the existing product
    await existingProduct.update({
      name,
      description,
      colors,
      image,
      price,
      sizes,
      slug,
      stock,
      deliveryCharge,
      discount,
    });
    await existingProduct.addCategories(req.body.categories);
    await existingProduct.removeCategories(req.body.removedCategories);
    return sendGoodResponse(res, { success: true, message: 'Product updated successfully', product: await existingProduct.reload({ include: Category },) });
  } catch (error) {
    console.error('Error updating product:', error);
    return sendBadResponse(res, { status: "failed", error: 'Internal Server Error' });
  }
};


/**
 * Deletes a product based on the provided product ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>}
 */
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Check if the product with the given ID exists
    const existingProduct = await Product.findByPk(productId);
    if (!existingProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Delete the product
    await existingProduct.destroy();

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @returns 
 */
const addColor = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "failed", errors: errors.array({ onlyFirstError: true }) });
  }

  const product = await Product.findByPk(req.params.productId)
  if (!product) return sendBadResponse(res, { status: "failed", msg: "invalid product" });
  console.log(product);
  try {
    const {
      colorName,
      colorCode,
    } = req.body;
    const image = req.file.path;

    const color = await Color.create({ colorCode, colorName, image }, { include: product });

    return sendGoodResponse(res, { status: "success", color: color })

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ status: "failed", error: 'Internal Server Error' });
  }
}

/**
 * Updates a color based on the provided color ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>}
 */
const updateColor = async (req, res) => {
  try {
    const colorId = req.params.colorId;

    // Check if the color with the given ID exists
    const existingColor = await Color.findByPk(colorId);
    if (!existingColor) {
      return res.status(404).json({ status: "failed", error: 'Color not found' });
    }

    // Update color fields based on the request body
    const {
      colorName,
      colorCode,
    } = req.body;

    // If you want to ensure the color is associated with a specific product
    // const productId = req.params.productId; // Assuming product ID is passed in the URL
    // const product = await Product.findByPk(productId);
    // if (!product) return res.status(400).json({ status: "failed", error: 'Invalid product ID' });

    // Update the existing color
    const updatedColor = await existingColor.update({
      colorName,
      colorCode,
      image: req.file ? req.file.path : existingColor.image,
    });

    return sendGoodResponse(res, { status: "success", message: 'Color updated successfully', color: updatedColor });
  } catch (error) {
    console.error('Error updating color:', error);
    res.status(500).json({ status: "failed", error: 'Internal Server Error' });
  }
};

/**
 * Deletes a color based on the provided color ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
const deleteColor = async (req, res) => {
  try {
    const colorId = req.params.colorId;

    // Check if the color with the given ID exists
    const existingColor = await Color.findByPk(colorId);
    if (!existingColor) {
      return res.status(404).json({ success: false, error: 'Color not found' });
    }

    // Delete the color
    await existingColor.destroy();

    return sendGoodResponse(res, { success: true, message: 'Color deleted successfully' })
  } catch (error) {
    console.error('Error deleting color:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    sendGoodResponse(res, { status: 'success', products: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ status: 'failed', error: 'Internal Server Error' });
  }
}

const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findByPk(productId,{include: [{ model: Color }, { model: Category }]});

    if (!product) {
      return res.status(404).json({ status: 'failed', error: 'Product not found' });
    }

    res.status(200).json({ status: 'success', product: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ status: 'failed', error: 'Internal Server Error' });
  }
}

module.exports = { addProduct, updateProduct, deleteProduct, addColor, deleteColor, updateColor, getAllProducts, getSingleProduct }