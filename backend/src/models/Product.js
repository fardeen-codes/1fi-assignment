const mongoose = require("mongoose");
const { Schema } = mongoose;

// ---------------------------------------------------------------------------
// Schema design (MongoDB / Mongoose)
// ---------------------------------------------------------------------------
// A "product" (e.g. iPhone 17 Pro) embeds its "variants" (storage/color
// combos), and each variant embeds its own "emiPlans". This mirrors the
// document-oriented shape MongoDB is built for: a single product page fetch
// is a single findOne() with everything already nested, no joins needed.
// Mongoose auto-generates an _id for every subdocument, which we expose as
// `id` in the API responses.
// ---------------------------------------------------------------------------

const EmiPlanSchema = new Schema(
  {
    tenureMonths: { type: Number, required: true },
    monthlyAmount: { type: Number, required: true }, // in rupees
    interestRate: { type: Number, required: true, default: 0 }, // percent, e.g. 0 or 10.5
    cashbackAmount: { type: Number, required: true, default: 0 }, // in rupees
    sortOrder: { type: Number, required: true, default: 0 },
  },
  { _id: true }
);

const VariantSchema = new Schema(
  {
    variantLabel: { type: String, required: true }, // e.g. "256GB / Silver"
    color: { type: String },
    storage: { type: String },
    mrp: { type: Number, required: true }, // in rupees
    price: { type: Number, required: true }, // selling price, in rupees
    imageUrl: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    emiPlans: { type: [EmiPlanSchema], default: [] },
  },
  { _id: true }
);

const ProductSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true }, // used in URL: /products/:slug
    name: { type: String, required: true }, // e.g. "iPhone 17 Pro"
    brand: { type: String, required: true },
    description: { type: String },
    soldCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    sellerName: { type: String, default: "1Fi Marketplace" },
    dispatchMessage: { type: String },
    deliveryMessage: { type: String },
    replacementMessage: { type: String },
    variants: { type: [VariantSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
