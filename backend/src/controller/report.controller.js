const moment = require("moment");
const asyncWrapper = require("../middlewares/asyncWrapper");
const prisma = require("../db/prisma");

exports.getDailyRevenueReport = asyncWrapper(async (req, res, next) => {
    const { startDate = new Date(), endDate = new Date() } = req.query;

    const whereCondition = {};
    if (startDate && endDate) {
        whereCondition.createdAt = {
            gte: moment(startDate).startOf("day").toDate(),
            lte: moment(endDate).endOf("day").toDate(),
        };
    }

    const orders = await prisma.orders.findMany({
        where: whereCondition,
        include: {
            orderItems: true,
        },
    });

    // Group and calculate daily revenue
    const revenueMap = {};

    orders.forEach((order) => {
        const dateKey = moment(order.createdAt).format("YYYY-MM-DD");

        if (!revenueMap[dateKey]) {
            revenueMap[dateKey] = {
                date: dateKey,
                total_orders: 0,
                total_revenue: 0,
            };
        }

        revenueMap[dateKey].total_orders += 1;

        order.orderItems.forEach((item) => {
            revenueMap[dateKey].total_revenue += (item.price || 0) * item.quantity;
        });
    });

    const report = Object.values(revenueMap).sort((a, b) =>
        moment(b.date).diff(moment(a.date))
    );

    return res.status(200).json({
        success: true,
        data: report,
    });
});

exports.getTopSpenders = asyncWrapper(async (req, res, next) => {
    const topSpenders = await prisma.orderItem.groupBy({
        by: ['orderId', 'userId'],
        _sum: {
            price: true,
            quantity: true,
        },
        orderBy: {
            _sum: {
                price: 'desc',
            },
        },
        take: 10,
    });

    return res.status(200).json({
        success: true,
        topSpenders
    })
})

exports.getTopUsers = asyncWrapper(async (req, res, next) => {
    const topUsers = await prisma.orders.groupBy({
        by: ['userId'],
        _sum: {
            total: true,
        },
        orderBy: {
            _sum: {
                total: 'desc',
            },
        },
        take: 10,
        where: {
            orderItems: {
                some: {
                    productId: specificProductId,
                },
            },
        },
    });



    return res.status(200).json({
        success: true,
        topUsers
    })
})