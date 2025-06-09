const { Router } = require("express");
const { isAuthentictedUser } = require("../middlewares/auth");
const { addToCart, getCart, updateQuantity, removeItem } = require("../controller/cart.controller");


const router = Router();

router.route("/cart")
    .post(isAuthentictedUser, addToCart)
    .get(isAuthentictedUser, getCart)
    .put(isAuthentictedUser, updateQuantity)
    .delete(isAuthentictedUser, removeItem)

module.exports = router;