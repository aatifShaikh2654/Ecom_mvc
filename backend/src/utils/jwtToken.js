const jwt = require("jsonwebtoken");


const sendJWTToken = async (res, user, message) => {

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 10000,
        ),
        httpOnly: false,
        sameSite: "Strict",
        secure: true,
        domain: process.env.DOMAIN
    }



    return res.status(200).cookie("token", token, options).json({
        message,
        success: true,
        user
    })
}

module.exports = sendJWTToken;