const User = require('./users')
const Product = require('./product');
const Category = require('./category');
const ProductCategory = require('./product_category');
const Favorite = require('./favourite');
const ProductReview = require('./product_review');
const ProductOrder = require('./product_order');
const ProductOederItems = require('./product_order_items');
const OTP = require('./otp');


 
Category.hasMany(Category, {as: "Sub Category", onDelete: "CASCADE"})

// Define the many-to-many relationship
Product.belongsToMany(Category,{through: ProductCategory});
Category.belongsToMany(Product, {through: ProductCategory});

Product.belongsToMany(User, { through: Favorite, onDelete: "CASCADE"});
User.belongsToMany(Product, {through: Favorite, onDelete: "CASCADE"})

Product.hasMany(ProductReview);
User.hasMany(ProductReview);
ProductReview.belongsTo(Product);
ProductReview.belongsTo(User);

User.hasMany(ProductOrder);
ProductOrder.belongsTo(User);

ProductOrder.hasMany(ProductOederItems)
ProductOederItems.belongsTo(ProductOrder)

OTP.belongsTo(User);
User.hasMany(OTP);

