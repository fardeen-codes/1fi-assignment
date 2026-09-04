const { connectDB, mongoose } = require("./db");
const Product = require("./models/Product");
const catalog = require("./catalog.json");

function buildEmiPlans(price, cashback = 7500) {
  const tenures = [
    { months: 3, rate: 0 },
    { months: 6, rate: 0 },
    { months: 12, rate: 0 },
    { months: 24, rate: 0 },
    { months: 36, rate: 10.5 },
    { months: 48, rate: 10.5 },
    { months: 60, rate: 10.5 },
  ];

  return tenures.map(({ months, rate }, sortOrder) => {
    const totalInterest = rate > 0 ? price * (rate / 100) * (months / 12) : 0;
    return {
      tenureMonths: months,
      monthlyAmount: Math.round((price + totalInterest) / months),
      interestRate: rate,
      cashbackAmount: cashback,
      sortOrder,
    };
  });
}

async function seed() {
  await connectDB();
  await Product.deleteMany({});

  const documents = catalog.map((product) => ({
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      emiPlans: buildEmiPlans(variant.price),
    })),
  }));

  await Product.insertMany(documents);
  console.log(`Seeded ${documents.length} products successfully.`);
  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exitCode = 1;
});
