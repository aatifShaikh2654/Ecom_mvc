const asyncWrapper = require("../middlewares/asyncWrapper");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const { apiFeature } = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const path = require("path")
const fs = require("fs")

exports.addProduct = asyncWrapper(async (req, res, next) => {
    const user = req.user;

    const { name, description, price, stock, category } = req.body;

    if (!name || !price) {
        return res.status(404).json({ success: false, message: "Name or price not found" })
    }

    const files = req.files;
    const imagePaths = files.map(file => file.path);

    const product = await Product.create({
        name,
        description,
        price,
        stock,
        category,
        images: imagePaths
    })

    await product.save();

    return res.status(200).json({ success: true, message: "Product added Successfully", product })

})

exports.getProducts = asyncWrapper(async (req, res, next) => {
    const { search, category: categorySlug } = req.query;

    const query = apiFeature(req.query, ['name', 'description'], ['dateFrom', 'dateTo']);
    const { skip, params: { limit, page } } = query;

    const where = {};

    let categoryFilter = {};
    if (categorySlug) {
        const category = await Category.findOne({ slug: categorySlug });
        if (category?._id) {
            categoryFilter.category = category._id;
        }
    }

    if (search) {
        const regex = new RegExp(search, "i");
        where.$or = [
            { name: regex },
            { description: regex },
        ];
    }

    const filter = { ...categoryFilter, ...where };

    const [products, totalCount] = await Promise.all([
        Product.find(filter)
            .skip(skip)
            .limit(limit)
            .populate("category"),
        Product.countDocuments(filter)
    ]);

    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: products,
        pagination: {
            currentPage: parseInt(page) || 1,
            totalPages: Math.ceil(totalCount / limit),
            totalCounts: totalCount,
            limit,
        },
    });
});


exports.updateProduct = asyncWrapper(async (req, res, next) => {
    const user = req.user;

    const { name, productId, description, price, stock, category } = req.body;

    if (!name || !price) {
        return res.status(404).json({ success: false, message: "Name or price not found" })
    }

    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
        return next(new ErrorHandler("Product Not found", 404))
    }

    const deletedImages = req.body.deletedImages ? JSON.parse(req.body.deletedImages) : [];

    if (deletedImages.length > 0) {
        deletedImages.forEach(async (imgPath) => {
            const fullPath = path.join(__dirname, "..", "..", imgPath);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        });
    }

    const newImagePaths = req.files?.map(file => file.path) || [];

    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    product.images = product.images.filter(img => !deletedImages.includes(img));

    product.images = [...product.images, ...newImagePaths];

    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.category = category;

    await product.save();

    return res.status(200).json({ success: true, message: "Product Updated Successfully", product })

})

exports.deleteProduct = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new ErrorHandler("Id not found", 404))
    }

    const product = await Product.deleteOne({ _id: id })

    return res.status(200).json({ success: true, message: "Product delete successfully" })

})

exports.getSingleProduct = asyncWrapper(async (req, res, next) => {
    const { slug } = req.params;

    const product = await Product.findOne({ slug }).populate("category")

    return res.status(200).json({ success: true, message: "Product fetched Successfully", data: product })

})

exports.addCategory = asyncWrapper(async (req, res, next) => {
    const user = req.user;

    const { name } = req.body;

    const image = req.file ? req.file.path : null;

    const categoryExist = await Category.findOne({ name: name })

    if (categoryExist) {
        return next(new ErrorHandler("Category already Exists", 400))
    }

    const category = await Category.create({
        name,
        image
    })

    return res.status(200).json({
        success: true,
        message: "Category Added Successfully",
        data: category
    })

})

exports.updateCategory = asyncWrapper(async (req, res, next) => {
    const user = req.user;

    const { name, categoryId } = req.body;

    const image = req.file ? req.file.path : null;

    if (!categoryId) {
        return res.status(404).json({ success: false, message: "Category Id not found" })
    }

    console.log(req.body)

    const existingCategory = await Category.findOne({
        $and: [
            { _id: { $ne: categoryId } },
            { name }
        ]
    });

    if (existingCategory) {
        return next(new ErrorHandler("Category already Exists", 400))
    }

    const category = await Category.updateOne(
        { _id: categoryId },
        {
            name,
            ...(image && { image })
        })

    return res.status(200).json({
        success: true,
        message: "Category Updated Successfully",
        category
    })

})

exports.deletCategory = asyncWrapper(async (req, res, next) => {
    const user = req.user;

    const { categoryId } = req.query;

    if (!categoryId) {
        return res.status(404).json({ success: false, message: "Category Id not found" })
    }

    const category = await Category.deleteOne({ _id: categoryId })

    return res.status(200).json({
        success: true,
        message: "Category delete Successfully",
    })

})


exports.getCategory = asyncWrapper(async (req, res, next) => {

    const category = await Category.find();

    return res.status(200).json({
        success: true,
        message: "Category fetched Successfully",
        data: category
    })

})

exports.getSingleCategory = asyncWrapper(async (req, res, next) => {

    const { slug } = req.params;
    const categoryData = await Category.findOne({ slug });

    return res.status(200).json({
        success: true,
        message: "Category fetched Successfully",
        data: categoryData
    })

})
