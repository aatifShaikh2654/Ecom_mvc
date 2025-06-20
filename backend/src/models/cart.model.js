const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1
                }
            }
        ]
    },
    { timestamps: true }
)

const Cart = mongoose.model("Cart", cartSchema)

module.exports = Cart