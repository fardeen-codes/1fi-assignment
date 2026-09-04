import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api";
import { formatRupees } from "../utils/format";
import Navbar from "../components/Navbar";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data.products);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, []);

  if (status === "loading") {
    return <CenteredMessage text="Loading products…" />;
  }

  if (status === "error") {
    return <CenteredMessage text={`Couldn't load products: ${error}`} isError />;
  }

  return (
    <div className="marketplace-shell">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Shop on EMI</h1>
        <p className="text-gray-500 mt-1">
          Flexible EMI plans backed by mutual funds - no credit card required.
        </p>
        </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.slug}`}
            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
              <img
                src={product.defaultVariant.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
                {product.brand}
              </p>
              <h2 className="text-lg font-semibold text-gray-900 mt-1">{product.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {product.variantCount} variant{product.variantCount > 1 ? "s" : ""} available
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {formatRupees(product.defaultVariant.price)}
                </span>
                {product.defaultVariant.discount > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatRupees(product.defaultVariant.mrp)}
                  </span>
                )}
              </div>
              <p className="text-xs text-green-600 mt-1">
                EMI from {formatRupees(lowestEmi(product.defaultVariant))}/mo
              </p>
            </div>
          </Link>
        ))}
      </div>
      </main>
    </div>
  );
}

function lowestEmi(variant) {
  if (!variant.emiPlans?.length) return 0;
  return Math.min(...variant.emiPlans.map((p) => p.monthlyAmount));
}

function CenteredMessage({ text, isError }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <p className={isError ? "text-red-600" : "text-gray-500"}>{text}</p>
    </div>
  );
}
