const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const ErrorHandler = require("../utils/errorHandler");


const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        image: {
            type: String,
        }
    },
    { timestamps: true }
);

categorySchema.virtual("products", {
    ref: "Product",
    localField: "_id",
    foreignField: "category",
});
categorySchema.set("toObject", { virtuals: true });
categorySchema.set("toJSON", { virtuals: true });

categorySchema.pre("save", async function (next) {
    if (this.isModified("name")) {
        const newSlug = slugify(this.name, { lower: true, strict: true });

        // Check if the slug already exists (exclude self for updates)
        const existing = await mongoose.models.Category.findOne({
            slug: newSlug,
            _id: { $ne: this._id }
        });

        if (existing) {
            return next(new ErrorHandler("Category slug already exists.", 400));
        }

        this.slug = newSlug;
    }

    next();
});

const Category = mongoose.model("Category", categorySchema)

module.exports = Category