const User = require('./users')
const Product = require('./product');
const Colors = require('../model/color');
const Category = require('./category');
const ProductCategory = require('./product_category');


Product.hasOne(Colors,{onDelete: "CASCADE"});
Colors.belongsTo(Product, { onDelete: "CASCADE" });

Category.hasMany(Category, {as: "Sub Category", onDelete: "CASCADE"})

// Define the many-to-many relationship
Product.belongsToMany(Category,{through: ProductCategory});
Category.belongsToMany(Product, {through: ProductCategory});