const Product = require("../model/product")

/**
 * 
 * @param {boolean} seed 
 */
const productSeeder = (seed)=>{
    // if(seed===false) return;
    Product.create({
       "name": "Dummy Product",
       "description": "This is the dummy product description",
       deliveryCharge: 50,
       sizes: ["xl", "xxl"],
       discount: 10,
       image: "uploads/1708876091790-1.png",
       slug: "dummy-product",
       stock: 5,
       price: 800,
    });
}

module.exports = productSeeder;