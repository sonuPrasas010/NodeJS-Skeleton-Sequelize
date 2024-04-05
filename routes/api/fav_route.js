const express = require("express");
const router =  express.Router();

const favoriteController = require("../../controllers/api/favourite_controller");
const { authenticateJWTForUser } = require("../../middlewares/auth_middleware");

router.put("/:productId", authenticateJWTForUser, favoriteController.addToFavorites);
router.delete("/:productId", authenticateJWTForUser,favoriteController.removeFromFavorites);

module.exports = router;