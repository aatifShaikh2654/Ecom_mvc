const asyncWrapper = require("../middlewares/asyncWrapper");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model")
const ErrorHandler = require("../utils/errorHandler");

exports.addToCart = asyncWrapper(async (req, res, next) => {
    const user = req.user;
    const { product, quantity } = req.body;

    if (!product || !quantity || quantity <= 0) {
        return next(new ErrorHandler("Invalid product or quantity", 400));
    }

    const currentProduct = await Product.findById(product);
    if (!currentProduct) {
        return next(new ErrorHandler("Product not found", 404));
    }

    let cart = await Cart.findOne({ userId: user.id });

    let updatedItem;

    if (!cart) {
        cart = await Cart.create({
            userId: user.id,
            items: [{ product, quantity }],
        });
        updatedItem = { product: currentProduct, quantity };
    } else {
        const existingItem = cart.items.find(
            (item) => item.product.toString() === product
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            updatedItem = { product: currentProduct, quantity: existingItem.quantity };
        } else {
            cart.items.push({ product, quantity });
            updatedItem = { product: currentProduct, quantity };
        }

        await cart.save();
    }

    return res.status(200).json({
        success: true,
        message: "Product added to cart",
        data: updatedItem,
    });
});

exports.getCart = asyncWrapper(async (req, res, next) => {
    const user = req.user;

    let cart = await Cart.findOne({ userId: user.id }).populate("items.product");

    return res.status(200).json({ success: true, message: "Cart fetched successfully", data: cart?.items || [] })

})

exports.removeItem = asyncWrapper(async (req, res, next) => {
    const user = req.user;

    const { product } = req.query;

    if (!product) {
        return next(new ErrorHandler('Product not found'));
    }

    let cart = await Cart.findOne({ userId: user.id });

    if (!cart) {
        return next(new ErrorHandler("Cart not found", 400))
    }

    cart.items = cart.items.filter(item => item.product.toString() !== product)

    await cart.save();

    return res.status(200).json({ success: true, message: "Item removed from cart", cart })

})

exports.updateQuantity = asyncWrapper(async (req, res, next) => {
    const user = req.user;

    const { product, quantity, type = "increase" } = req.body;

    if (!product) {
        return next(new ErrorHandler('Product not found'));
    }

    let cart = await Cart.findOne({ userId: user.id });

    if (!cart) {
        return next(new ErrorHandler("Cart not found", 400))
    }

    const existingItem = cart.items.find(item => item.product.toString() === product);

    if (existingItem) {
        if (type === "increase") {
            existingItem.quantity += quantity;
        } else {
            existingItem.quantity -= 1;
        }
        await cart.save();
    }

    return res.status(200).json({
        success: true,
        message: `Quantitly ${type} successfully`,
        cart
    })

})