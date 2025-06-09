const prisma = require("../db/prisma");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const ErrorHandler = require("../utils/errorHandler");
const sendJWTToken = require("../utils/jwtToken");
const { apiFeature } = require("../utils/apiFeatures");
const Cart = require("../models/cart.model");

exports.registerUser = asyncWrapper(async (req, res, next) => {

    const { name, email, phone, password, cartData } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: `${JSON.stringify(errors.array())}`
        })
    }

    const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { phone }] },
    });

    if (existingUser) {
        return next(new ErrorHandler("Email or phone number already exists.", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            phone,
            password: hashedPassword
        }
    })


    if (cartData && cartData.length > 0) {
        let cart = await Cart.create({
            userId: user.id,
            items: cartData.map((item) => { return { product: item.product?._id, quantity: item.quantity } }),
        })
    }

    sendJWTToken(res, { ...user, password: null }, "Registered in successfully");

})

exports.login = asyncWrapper(async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: `${JSON.stringify(errors.array())}`
        })
    }

    const { email, password, cartData } = req.body;

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" })
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        return res.status(401).json({ success: false, message: "Password doesn't match" });
    }

    if (user.role !== "ADMIN") {
        let cart = await Cart.findOne({ userId: user.id });


        if (cartData && cartData.length > 0) {
            if (!cart) {
                cart = await Cart.create({
                    userId: user.id,
                    items: cartData.map((item) => { return { product: item.product?._id, quantity: item.quantity } }),
                })
            } else {
                cartData.forEach((cartItem) => {
                    const existingItem = cart.items.find(item => item.product.toString() === cartItem.product?._id);

                    if (existingItem) {
                        existingItem.quantity += cartItem.quantity;
                    } else {
                        cart.items.push({ product: cartItem.product, quantity: cartItem.quantity });
                    }
                })
            }
        }

        await cart.save();
    }

    sendJWTToken(res, { ...user, password: null }, "Login in successfully");

})

exports.updateProfile = asyncWrapper(async (req, res, next) => {

    const { id } = req.params;
    if (!id) {
        return next(new ErrorHandler("Id not found", 404))
    }

    const { name, email, phone, password, role, confirmPassword } = req.body;

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    // Check if email or phone already exists for a different user
    const existingUser = await prisma.user.findFirst({
        where: {
            AND: [
                { id: { not: id } },
                { OR: [{ email }, { phone }] },
            ]
        }
    });

    if (existingUser) {
        return next(new ErrorHandler("Email or phone is already in use.", 400));
    }

    // If email is changed, require current password
    if (email !== user.email) {

        if (!password) {
            return next(new ErrorHandler("Password is required to change email", 400));
        }

        if (password || confirmPassword) {
            if (password !== confirmPassword) {
                return next(new ErrorHandler("Password does not match.", 400));
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return next(new ErrorHandler("Invalid Password", 401));
            }
        }
    }

    let hashedPassword = null;
    if (password || confirmPassword) {
        if (password !== confirmPassword) {
            return next(new ErrorHandler("Password does not match.", 400));
        }
        hashedPassword = await bcrypt.hash(password, 10);
    }



    const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            email,
            name,
            phone,
            role,
            ...(hashedPassword && { password: hashedPassword }),
        },
    });


    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser
    });
})

exports.getProfile = asyncWrapper(async (req, res, next) => {

    const user = req.user;

    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
    });
});

exports.getUsers = asyncWrapper(async (req, res, next) => {

    const user = req.user;
    const query = apiFeature(req.query, ['name', 'email', 'phone'], ["dateFrom", "dateTo"]);

    let users;
    users = await prisma.user.findMany({
        where: {
            ...query.where,
            role: { notIn: ["ADMIN"] }
        },
        orderBy: query.orderBy,
        skip: query.skip,
        take: query.take,
    });

    // Get total count for pagination
    const totalCount = await prisma.user.count({
        where: {
            ...query.where,
            role: { notIn: ["ADMIN"] }
        },
    });


    const totalPages = Math.ceil(totalCount / query.params.limit);

    res.status(200).json({
        success: true,
        data: users,
        pagination: {
            currentPage: query.params.page,
            totalPages: totalPages,
            totalCounts: totalCount,
            limit: query.params.limit,
        },
        message: "Users fetched successfully"
    });
})


exports.verifyUser = asyncWrapper(async (req, res, next) => {
    const user = req.user;
    const role = user?.role;

    res.status(200).json({
        success: true,
        message: "User is authenticated",
        role: role
    })

})

exports.logoutUser = asyncWrapper(async (req, res) => {

    const options = {
        httpOnly: true,
        sameSite: "Strict",
        domain: process.env.DOMAIN,
        secure: true, // Ensure secure is only used in production
        path: "/"  // ✅ Must match the original cookie path
    };

    res.clearCookie("token", options).status(200).json({
        success: true,
        message: "User logged out successfully"
    });
});