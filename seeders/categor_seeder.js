const Category = require("../model/category");
const Product = require("../model/category")

/**
 * 
 * @param {boolean} seed 
 */
const categorySeeder = (seed)=>{
    // if(seed===false) return;
   Category.create({
    name: "dummy category",
    slug: "dummy-category"
   });
}

module.exports = categorySeeder;