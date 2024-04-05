const express = require('express');
const { deleteCategory, getCategoryById, getAllCategories, updateCategory, createCategory } = require('../../controllers/admin/category_controller');
const { check } = require('express-validator');
const Category = require('../../model/category');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/', getAllCategories);
router.get('/:categoryId', getCategoryById);
router.post('/', [
    check("name").notEmpty(),
    check("slug").notEmpty().custom(async (slug)=>{
        if (slug.includes(' ')) {
            throw new Error('Slug must not contain spaces');
          }
        const slugCount = await Category.count({where: {slug}});
        if(slugCount == 0) return 0;
        return Promise.reject(new Error("Slug already exists"));
    }).trim(),
] ,createCategory);

router.put('/:categoryId',  [
    check("name").trim().notEmpty(),
    check("slug").trim().notEmpty().custom(async (slug, { req })=>{
        if (slug.includes(' ')) {
            throw new Error('Slug must not contain spaces');
          }
        const slugCount = await Category.count({where: {slug, id: { [Op.ne]: req.params.categoryId } }});
        if(slugCount == 0) return 0;
        return Promise.reject(new Error("Slug already exists"));
    }),    
] ,updateCategory);

router.delete('/:categoryId', deleteCategory)

module.exports.adminCategoryRoute = router;