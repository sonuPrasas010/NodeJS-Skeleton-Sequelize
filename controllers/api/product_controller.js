const { validationResult } = require('express-validator');
const Product = require('../../model/product'); // Adjust the path based on your project structure
const { sendGoodResponse, sendBadResponse, upload, moveTempFileToPermanentDestination } = require('../../helpers/helper');
const Category = require('../../model/category');





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

const addToCart = (req, res) =>{}

const uploadImageForTest= (req, res) => {
  console.log(req.file);
  moveTempFileToPermanentDestination(req.file.path, req.file.filename, "public/uploads/")
}

module.exports = { getAllProducts, getSingleProduct, uploadImageForTest }