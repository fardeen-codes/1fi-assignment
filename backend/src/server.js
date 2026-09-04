const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// -----------------------------------------------------------------------
// Serializers — shape Mongoose documents into plain API JSON
// -----------------------------------------------------------------------
function serializePlan(plan) {
  return {
    id: plan._id,
    tenureMonths: plan.tenureMonths,
    monthlyAmount: plan.monthlyAmount,
    interestRate: plan.interestRate,
    cashbackAmount: plan.cashbackAmount,
  };
}

function serializeVariant(variant) {
  const plans = [...variant.emiPlans].sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    id: variant._id,
    variantLabel: variant.variantLabel,
    color: variant.color,
    storage: variant.storage,
    mrp: variant.mrp,
    price: variant.price,
    discount: variant.mrp - variant.price,
    imageUrl: variant.imageUrl,
    isDefault: !!variant.isDefault,
    emiPlans: plans.map(serializePlan),
  };
}

function serializeProduct(product) {
  const variants = product.variants
    .slice()
    .sort((a, b) => (b.isDefault === true) - (a.isDefault === true))
    .map(serializeVariant);
  return {
    id: product._id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    description: product.description,
    soldCount: product.soldCount,
    rating: product.rating,
    sellerName: product.sellerName,
    dispatchMessage: product.dispatchMessage,
    deliveryMessage: product.deliveryMessage,
    replacementMessage: product.replacementMessage,
    variants,
  };
}

// -----------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------

// GET /api/products - list all products (summary: default variant only)
app.get("/api/products", async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: 1 });
    const summaries = products.map((product) => {
      const full = serializeProduct(product);
      const defaultVariant = full.variants.find((v) => v.isDefault) || full.variants[0];
      return {
        id: full.id,
        slug: full.slug,
        name: full.name,
        brand: full.brand,
        description: full.description,
        variantCount: full.variants.length,
        defaultVariant,
      };
    });
    res.json({ count: summaries.length, products: summaries });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:slug - full product detail with all variants + EMI plans
app.get("/api/products/:slug", async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ error: `Product '${req.params.slug}' not found` });
    }

    res.json(serializeProduct(product));
  } catch (err) {
    next(err);
  }
});

// GET /api/health - basic health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`1Fi EMI backend running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
