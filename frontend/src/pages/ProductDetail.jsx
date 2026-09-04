import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../api";
import { formatRupees } from "../utils/format";
import Navbar from "../components/Navbar";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  useEffect(() => {
    setStatus("loading");
    getProduct(slug)
      .then((data) => {
        setProduct(data);
        const defaultVariant = data.variants.find((v) => v.isDefault) || data.variants[0];
        setSelectedVariantId(defaultVariant?.id ?? null);
        setSelectedPlanId(defaultVariant?.emiPlans[0]?.id ?? null);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, [slug]);

  if (status === "loading") return <CenteredMessage text="Loading product…" />;
  if (status === "error") return <CenteredMessage text={`Couldn't load product: ${error}`} isError />;

  const variant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const selectedPlan = variant.emiPlans.find((p) => p.id === selectedPlanId) || variant.emiPlans[0];

  function handleVariantChange(newVariant) {
    setSelectedVariantId(newVariant.id);
    setSelectedPlanId(newVariant.emiPlans[0]?.id ?? null);
  }

  function handleProceed() {
    navigate("/checkout", { state: { product, variant, plan: selectedPlan } });
  }

  return (
    <div className="marketplace-shell">
      <Navbar />

      <main className="product-page">
        <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/">Smart Phones</Link><span>/</span><strong>{product.name}</strong></div>
        <div className="product-layout">
          <section className="gallery-panel">
          <div className="gallery-main">
            <img
              src={variant.imageUrl}
              alt={`${product.name} - ${variant.variantLabel}`}
              className="gallery-image"
            />
            <span className="sold-badge">{product.soldCount}+ sold</span>
          </div>
          <div className="thumbnail-row">
            {product.variants.map((v) => (
              <button type="button" key={v.id} onClick={() => handleVariantChange(v)} className={`thumbnail ${v.id === variant.id ? "thumbnail-active" : ""}`} aria-label={`Select ${v.variantLabel}`}>
                <img src={v.imageUrl} alt="" />
              </button>
            ))}
          </div>
          <div className="gallery-benefits"><div><span>✓</span><strong>Free delivery</strong><small>On this product</small></div><div><span>✓</span><strong>Secure transaction</strong><small>Your data is protected</small></div></div>
          </section>

          <section className="purchase-panel">
            <p className="eyebrow">{product.brand}</p>
            <h1>{product.name} <span>({variant.color}, {variant.storage})</span></h1>
            <div className="rating-row"><span className="rating">★ {product.rating}</span><span>Top rated product</span></div>
            <div className="variant-summary"><div><span>Color</span><strong>{variant.color}</strong></div><div><span>Storage</span><strong>{variant.storage}</strong></div></div>
            {product.variants.length > 1 && (<div className="variant-options"><p>Choose your variant</p><div>
                {product.variants.map((v) => (
                  <button
                    type="button"
                    key={v.id}
                    onClick={() => handleVariantChange(v)}
                    className={`variant-chip ${v.id === variant.id ? "variant-chip-active" : ""}`}
                  >
                    {v.variantLabel}
                  </button>
                ))}
            </div></div>)}
            <div className="price-block"><div><span className="current-price">{formatRupees(variant.price)}</span><span className="mrp">{formatRupees(variant.mrp)}</span><span className="discount">{Math.round((variant.discount / variant.mrp) * 100)}% off</span></div><p>Inclusive of all taxes</p></div>
            <div className="emi-box"><div className="emi-heading"><div><span className="emi-kicker">Pay flexibly</span><h2>Choose EMI tenure</h2></div><span className="emi-note">0% EMI available</span></div><div className="emi-grid">
            {variant.emiPlans.map((plan) => (
              <label key={plan.id} className={`emi-option ${plan.id === selectedPlanId ? "emi-option-active" : ""}`}>
                  <input
                    type="radio"
                    name="emi-plan"
                    checked={plan.id === selectedPlanId}
                    onChange={() => {
                      setSelectedPlanId(plan.id);
                    }}
                  />
                  <span className="emi-months">{plan.tenureMonths}<small>months</small></span><span className="emi-amount"><strong>{formatRupees(plan.monthlyAmount)}</strong><small>/ month</small></span><span className="emi-rate">{plan.interestRate > 0 ? `${plan.interestRate}%` : "0%"}<small>interest</small></span>
              </label>
            ))}
            </div><p className="cashback-line">✓ Get {formatRupees(selectedPlan?.cashbackAmount || 0)} cashback on this order</p></div>
            <button onClick={handleProceed} disabled={!selectedPlan} className="buy-button">Buy on {selectedPlan?.tenureMonths || ""} months EMI <span>→</span></button>

            <p className="seller-line">Sold by <strong>{product.sellerName}</strong><span>•</span> {product.dispatchMessage}</p>
          </section>
        </div>
        <section className="info-grid"><article><span className="info-icon">↗</span><div><h2>Shipping details</h2><p>{product.deliveryMessage} Free delivery on this order.</p></div></article><article><span className="info-icon">✓</span><div><h2>Shop with confidence</h2><p>{product.replacementMessage}</p></div></article><article><span className="info-icon">★</span><div><h2>Top brand</h2><p>Quality products from trusted brands with a superior customer experience.</p></div></article></section>
        {product.description && <section className="details-section"><h2>Product details</h2><p>{product.description}</p><div className="spec-list"><span>Brand <strong>{product.brand}</strong></span><span>Storage <strong>{variant.storage}</strong></span><span>Color <strong>{variant.color}</strong></span><span>Model <strong>{product.name}</strong></span></div></section>}
      </main>
    </div>
  );
}

function CenteredMessage({ text, isError }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <p className={isError ? "text-red-600" : "text-gray-500"}>{text}</p>
    </div>
  );
}
