const { Router } = require("express");
const { registerUser, login, getProfile, getUsers, updateProfile, verifyUser, logoutUser } = require("../controller/auth.controller");
const { isAuthentictedUser, authorizeRoles } = require("../middlewares/auth");
const { body } = require("express-validator")

const router = Router();

const validateUser = [
    body("name", "Name must be at least 4 characters").isLength({ min: 4 }),
    body("email", "Enter a valid email").isEmail(),
    body("phone", "Enter a valid phone number").isMobilePhone(), // ✅ best for real phone numbers
    body("password", "Password must be at least 3 characters").isLength({ min: 3 }),
];

const validateLogin = [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 3 characters").isLength({ min: 3 }),
];


router.route("/register").post(validateUser, registerUser)
router.route("/login").post(validateLogin, login)
router.route("/profile")
    .get(isAuthentictedUser, getProfile)
    .put(isAuthentictedUser, updateProfile)
router.route("/users").get(isAuthentictedUser, authorizeRoles("ADMIN"), getUsers)
router.route("/verify").get(isAuthentictedUser, verifyUser)
router.route("/logout").get(logoutUser)


module.exports = router;