const { validationResult } = require('express-validator');
const { sendGoodResponse, sendBadResponse } = require('../../helpers/helper');
const Category = require('../../model/category');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    sendGoodResponse(res,{ status: 'success', categories: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ status: 'failed', error: 'Internal Server Error' });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return sendBadResponse(res,{ status: 'failed', error: 'Category not found' });
    }

    sendGoodResponse(res,{ status: 'success', category: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ status: 'failed', error: 'Internal Server Error' });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const createCategory = async (req, res) => {
  try {
    const result = validationResult(req);
    if(!result.isEmpty()) return sendBadResponse(res, result.array({onlyFirstError:true}));
    const { name, description, slug } = req.body;
    const newCategory = await Category.create({ name, description, slug });

    res.status(201).json({ status: 'success', category: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ status: 'failed', error: 'Internal Server Error' });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const updateCategory = async (req, res) => {
  try {
    const result = validationResult(req);
    if(!result.isEmpty()) return sendBadResponse(res, result.array({onlyFirstError:true}));

    const categoryId = req.params.categoryId;
    const { name, description, slug } = req.body;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ status: 'failed', error: 'Category not found' });
    }

    const updatedCategory = await category.update({ name, description, slug });

    res.status(200).json({ status: 'category updated', category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ status: 'failed', error: 'Internal Server Error' });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ status: 'failed', error: 'Category not found' });
    }

    await category.destroy();

    res.status(200).json({ status: 'success', message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ status: 'failed', error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
