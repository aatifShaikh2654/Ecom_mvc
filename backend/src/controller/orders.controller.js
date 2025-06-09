const prisma = require("../db/prisma");
const asyncWrapper = require("../middlewares/asyncWrapper");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const { apiFeature } = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");

exports.checkout = asyncWrapper(async (req, res, next) => {
    const user = req.user;

    const { product, quantity, cartId, address, state, pincode, country, type = "cart", total } = req.body;

    let createdAddress = await prisma.address.findFirst({
        where: {
            AND: [
                { address },
                { pincode: parseInt(pincode) }
            ]
        }
    });
    if (!createdAddress) {
        createdAddress = await prisma.address.create({
            data: {
                address,
                state,
                pincode: parseInt(pincode),
                country
            }
        });
    }

    let order;
    if (type === "cart") {

        const cart = await Cart.findOne({ userId: user.id })

        if (!cart || cart.items.length === 0) {
            return next(new ErrorHandler({
                success: false,
                message: "Cart is empty or not found.",
            }));
        }

        order = await prisma.orders.create({
            data: {
                userId: user.id,
                cartId: cart._id.toString(),
                total,
                orderItems: {
                    createMany: {
                        data: cart.items.map((item) => ({
                            productId: item.product.toString(),
                            quantity: item.quantity,
                        })),
                    },
                },
                addressId: createdAddress.id
            }
        })

        await Cart.updateOne({ userId: user?._id }, {
            items: []
        })

    } else if (type === "buynow") {

        if (!product || !quantity) {
            return next(new ErrorHandler({
                success: false,
                message: "Product and quantity are required for buy now orders.",
            }));
        }

        order = await prisma.orders.create({
            data: {
                userId: user.id,
                total,
                orderItems: {
                    create: {
                        productId: product?._id,
                        quantity
                    }
                },
                addressId: createdAddress.id
            }
        })
    } else {
        return next(new ErrorHandler({
            success: false,
            message: "Invalid order type.",
        }));
    }

    return res.status(200).json({
        success: true,
        message: "Order placed Successfully",
        data: order
    })
})

exports.getOrders = asyncWrapper(async (req, res, next) => {
    const user = req.user;

    const orders = await prisma.orders.findMany({
        where: {
            userId: user.id
        },
        include: {
            orderItems: true,
        }
    })

    const enrichedOrders = await Promise.all(
        orders.map(async (order) => {
            const enrichedItems = await Promise.all(
                order.orderItems.map(async (item) => {
                    try {
                        const product = await Product.findById(item.productId).select("name price images description stock");

                        return {
                            ...item,
                            product,
                        };
                    } catch (err) {
                        return {
                            ...item,
                            product: null,
                        };
                    }
                })
            );

            return {
                ...order,
                orderItems: enrichedItems,
            };
        })
    );

    return res.status(200).json({
        success: true,
        message: "Orders fetched Successfully",
        data: enrichedOrders
    })

})

exports.getAllOrders = asyncWrapper(async (req, res, next) => {
    const user = req.user;

    const query = apiFeature(req.query, ["user.name", "user.email", "user.phone"], ["dateFrom", "dateTo"])

    const orders = await prisma.orders.findMany({
        where: {
            ...query.where,
        },
        include: {
            orderItems: true,
            user: true,
            address: true
        },
        skip: query.skip,
        take: query.take
    })

    const totalCount = await prisma.orders.count({
        where: {
            ...query.where,
        },
    });

    const enrichedOrders = await Promise.all(
        orders.map(async (order) => {
            const enrichedItems = await Promise.all(
                order.orderItems.map(async (item) => {
                    try {
                        const product = await Product.findById(item.productId).select("name price images description stock");

                        return {
                            ...item,
                            product,
                        };
                    } catch (err) {
                        return {
                            ...item,
                            product: null,
                        };
                    }
                })
            );

            return {
                ...order,
                orderItems: enrichedItems,
            };
        })
    );


    const totalPages = Math.ceil(totalCount / query.params.limit);

    res.status(200).json({
        success: true,
        data: enrichedOrders,
        pagination: {
            currentPage: query.params.page,
            totalPages: totalPages,
            totalCounts: totalCount,
            limit: query.params.limit,
        },
        message: "Orders fetched successfully"
    });

})

exports.getSingleOrder = asyncWrapper(async (req, res, next) => {
    const user = req.user;
    const { id } = req.params;

    let order = await prisma.orders.findFirst({
        id,
        userId: user.id
    });

    order = order.orderItems.map(async (item) => {
        try {
            const product = await Product.findById(item.productId).select("name price images description stock");

            return {
                ...item,
                product,
            };
        } catch (err) {
            return {
                ...item,
                product: null,
            };
        }
    })

    return res.status(200).json({
        success: true,
        message: "Order fetched successfully",
        order
    })
})