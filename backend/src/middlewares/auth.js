const asyncWrapper = require("./asyncWrapper");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
require("dotenv").config({ path: "backend/config/.env" })
const prisma = require("../db/prisma")

exports.isAuthentictedUser = asyncWrapper(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    const secretKey = process.env.JWT_SECRET

    // now verify that token with seceret key . 
    const deCodeToken = jwt.verify(token, secretKey);
    // now get user id from deCodeToken because when we make token in userSchema so we added userID in payLoad section. with that id get user and store inside req object .
    const user = await prisma.user.findUnique({
        where: { id: deCodeToken.id },
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true
        }
    })
    if (!user) {
        return next(new ErrorHandler("Please Login to Acceess this Resource", 401));
    }
    req.user = user; // now we have user in req.user

    next();

})


// taking role as param and converting it into array using spread operator. for using array method
exports.authorizeRoles = (...roles) => {
    return async (req, res, next) => {

        if (roles.includes(req.user.role) === false) {
            return next(
                new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resouce `,
                    403)
            )
        }
        next();
    }
}