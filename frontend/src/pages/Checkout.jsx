import { Link, useLocation } from "react-router-dom";
import { formatRupees } from "../utils/format";

export default function Checkout() {
  const { state } = useLocation();
  const { product, variant, plan } = state || {};

  if (!product || !variant || !plan) {
    return (
      <div className="checkout-empty">
        <h1>Your checkout session has expired</h1>
        <p>Choose a product and EMI plan to continue.</p>
        <Link to="/" className="buy-button checkout-link">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="marketplace-shell">
      <header className="checkout-header">
        <Link to="/" className="store-logo">1Fi<span></span></Link>
        <div><strong>Secure checkout</strong><span>🔒 Your information is protected</span></div>
      </header>
      <main className="checkout-page">
        <div className="checkout-breadcrumb"><Link to={`/products/${product.slug}`}>← Back to product</Link><span>Checkout</span></div>
        <h1>Complete your order</h1>
        <div className="checkout-layout">
          <section className="checkout-form">
            <div className="checkout-section"><div className="section-number">1</div><div className="section-content"><h2>Contact details</h2><p>We will use this to send your order updates.</p><label>Email address<input type="email" placeholder="you@example.com" /></label><label>Mobile number<input type="tel" placeholder="10-digit mobile number" /></label></div></div>
            <div className="checkout-section"><div className="section-number">2</div><div className="section-content"><h2>Delivery address</h2><p>Where should we deliver your order?</p><div className="form-row"><label>Full name<input type="text" placeholder="Your full name" /></label><label>Pincode<input type="text" placeholder="400001" /></label></div><label>Address<input type="text" placeholder="House / flat, street and area" /></label><div className="form-row"><label>City<input type="text" placeholder="Mumbai" /></label><label>State<input type="text" placeholder="Maharashtra" /></label></div></div></div>
            <div className="checkout-section"><div className="section-number">3</div><div className="section-content"><h2>Payment method</h2><p>Your selected EMI plan will be activated after confirmation.</p><div className="payment-choice"><span>◉</span><div><strong>Pay with {plan.tenureMonths}-month EMI</strong><small>{formatRupees(plan.monthlyAmount)} per month at {plan.interestRate}% interest</small></div></div><button type="button" className="place-order">Place order <span>→</span></button></div></div>
          </section>
          <aside className="order-summary"><h2>Order summary</h2><div className="summary-product"><img src={variant.imageUrl} alt={`${product.name} ${variant.variantLabel}`} /><div><strong>{product.name}</strong><span>{variant.variantLabel}</span><span>Qty: 1</span></div></div><div className="summary-lines"><span>Product price <strong>{formatRupees(variant.price)}</strong></span><span>Delivery <strong className="free-label">FREE</strong></span><span>Cashback <strong className="cashback-label">-{formatRupees(plan.cashbackAmount)}</strong></span></div><div className="summary-total"><span>Monthly EMI</span><strong>{formatRupees(plan.monthlyAmount)}<small> / month</small></strong></div><p className="summary-note">{plan.tenureMonths} monthly payments at {plan.interestRate}% interest</p></aside>
        </div>
      </main>
    </div>
  );
}