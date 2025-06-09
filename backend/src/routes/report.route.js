const { Router } = require("express");
const { isAuthentictedUser, authorizeRoles } = require("../middlewares/auth");
const { getDailyRevenueReport, getTopSpenders, getTopUsers } = require("../controller/report.controller");

const router = Router();

router.route("/revenue-reports").get(isAuthentictedUser, authorizeRoles("ADMIN"), getDailyRevenueReport)
router.route("/top-spenders").get(isAuthentictedUser, authorizeRoles("ADMIN"), getTopSpenders)
router.route("/top-spend-users").get(isAuthentictedUser, authorizeRoles("ADMIN"), getTopUsers)


module.exports = router;