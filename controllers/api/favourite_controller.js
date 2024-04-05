
/**
 * Controller handling operations related to favorites.
 * @module FavoriteController
 */

const { sendGoodResponse } = require("../../helpers/helper");
const Favorite = require("../../model/favourite");

/**
 * Add a product to a user's favorites.
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product to add to favorites.
 * @returns {Promise<Favorite>} The created favorite relationship.
 * @throws {Error} If the operation fails.
 */
async function addToFavorites(productId) {
    try {
        const user = req.user;
        const favorite = await Favorite.create({ userId: user.id, productId });
        return sendGoodResponse(res, { msg: "successfully added to favourite", data: favorite.toJSON() },)
    } catch (error) {
        throw new Error(`Failed to add product to favorites: ${error.message}`);
    }
}

/**
 * Remove a product from a user's favorites.
 * @param {import("express").Request} req 
 * @param {import("express").Response} res
 * @returns 
 */
async function removeFromFavorites(req, res) {
    try {
        const user = req.user;
        const productId = req.params.productId;
        const deletedCount = await Favorite.destroy({
            where: { userId: user.id, productId }
        });
        return sendGoodResponse(res, { "msg": "successfully deleted", });
    } catch (error) {
        throw new Error(`Failed to remove product from favorites: ${error.message}`);
    }
}

module.exports = {
    addToFavorites,
    removeFromFavorites
};
