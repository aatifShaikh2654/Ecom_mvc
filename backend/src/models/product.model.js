const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        images: [
            {
                type: String,
                trim: true,
            },
        ],
        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        available: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

productSchema.pre("save", async function (next) {
    if (this.isModified("name")) {
        const newSlug = slugify(this.name, { lower: true, strict: true });

        // Check if the slug already exists (exclude self for updates)
        const existing = await mongoose.models.Product.findOne({
            slug: newSlug,
            _id: { $ne: this._id }
        });

        if (existing) {
            return next(new ErrorHandler("Product slug already exists.", 400));
        }

        this.slug = newSlug;
    }

    next();
});

const Product = mongoose.model("Product", productSchema)

module.exports = Product