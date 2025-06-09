const { Router } = require("express");
const { isAuthentictedUser, authorizeRoles } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const { addProduct, getProducts, updateProduct, getSingleProduct, deleteProduct, deletCategory, getCategory, addCategory, updateCategory, getSingleCategory } = require("../controller/products.controller");

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/products");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Max
});


router.route("/product")
    .post(upload.array("images", 5), isAuthentictedUser, authorizeRoles("ADMIN"), addProduct)
    .get(getProducts)
    .put(upload.array("images", 5), isAuthentictedUser, authorizeRoles("ADMIN"), updateProduct)

router.route("/product/:id").delete(isAuthentictedUser, authorizeRoles("ADMIN"), deleteProduct)
router.route("/product/:slug").get(getSingleProduct)

router.route("/category")
    .post(upload.single("image"), isAuthentictedUser, authorizeRoles("ADMIN"), addCategory)
    .put(upload.single("image"), isAuthentictedUser, authorizeRoles("ADMIN"), updateCategory)
    .get(getCategory)
    .delete(isAuthentictedUser, authorizeRoles("ADMIN"), deletCategory)

router.route("/category/:slug").get(getSingleCategory)


module.exports = router;