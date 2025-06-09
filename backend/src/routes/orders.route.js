const { Router } = require("express");
const { isAuthentictedUser, authorizeRoles } = require("../middlewares/auth");
const { getOrders, getSingleOrder, checkout, getAllOrders } = require("../controller/orders.controller");


const router = Router();

router.route("/checkout").post(isAuthentictedUser, checkout)
router.route("/orders").get(isAuthentictedUser, getOrders)
router.route("/all-orders").get(isAuthentictedUser, authorizeRoles("ADMIN"), getAllOrders)
router.route("/order/:id").get(isAuthentictedUser, getSingleOrder)

module.exports = router;