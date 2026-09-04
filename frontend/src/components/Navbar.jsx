import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="onefi-navbar">
      <Link to="/" className="onefi-logo" aria-label="1Fi home">1Fi</Link>
      <nav className="onefi-nav-links" aria-label="Primary navigation">
        <Link to="/">Home</Link>
        <a href="#how-it-works">How it works</a>
        <Link to="/">Shop</Link>
        <a href="#benefits">Why 1Fi</a>
        <a href="#support">Support</a>
      </nav>
      <div className="onefi-nav-actions">
        <button type="button" className="onefi-login">Log in</button>
        <Link to="/" className="onefi-cta">Start shopping <span>&#8594;</span></Link>
      </div>
    </header>
  );
}
