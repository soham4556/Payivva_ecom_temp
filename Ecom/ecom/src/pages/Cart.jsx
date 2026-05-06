import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/helpers";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pv-cart {
    --gold: #D4A853;
    --gold-light: #F0C97A;
    --dark: #1A1814;
    --charcoal: #2C2820;
    --cream: #F5EDD8;
    --cream-deep: #EDE3CC;
    --muted: #8A8070;
    --surface: #FFFCF5;
    --danger: #C0392B;
  }

  .pv-cart { font-family: 'DM Sans', sans-serif; background: var(--surface); min-height: 80vh; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  .pv-cart .cart-animate { animation: fadeUp 0.5s ease both; }
  .pv-cart .ca-1 { animation-delay: 0.05s; }
  .pv-cart .ca-2 { animation-delay: 0.12s; }
  .pv-cart .ca-3 { animation-delay: 0.2s; }
  .pv-cart .ca-4 { animation-delay: 0.28s; }

  .pv-cart .cart-serif { font-family: 'Playfair Display', serif; }

  .pv-cart .gold-divider {
    width: 40px; height: 3px;
    background: var(--gold);
    border-radius: 2px;
    margin: 10px 0 0;
  }

  /* Cart item card */
  .pv-cart .cart-card {
    background: #fff;
    border: 1px solid rgba(44,40,32,0.08);
    border-radius: 20px;
    padding: 20px 24px;
    display: flex;
    gap: 18px;
    align-items: flex-start;
    transition: box-shadow 0.3s, border-color 0.3s, transform 0.3s cubic-bezier(.22,1,.36,1);
  }
  .pv-cart .cart-card:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    border-color: rgba(212,168,83,0.25);
    transform: translateY(-2px);
  }

  /* Summary panel */
  .pv-cart .summary-panel {
    background: var(--dark);
    border-radius: 24px;
    padding: 32px;
    position: sticky;
    top: 100px;
  }

  /* Buttons */
  .pv-cart .btn-primary {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%;
    padding: 15px 24px;
    background: var(--gold);
    color: var(--dark);
    border: none; border-radius: 14px;
    font-weight: 700; font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; text-decoration: none;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 6px 24px rgba(212,168,83,0.3);
  }
  .pv-cart .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(212,168,83,0.45);
    background: var(--gold-light);
  }

  .pv-cart .btn-ghost {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%;
    padding: 13px 24px;
    background: transparent;
    color: rgba(245,237,216,0.5);
    border: 1px solid rgba(245,237,216,0.12);
    border-radius: 14px;
    font-weight: 500; font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.25s;
  }
  .pv-cart .btn-ghost:hover {
    border-color: rgba(192,57,43,0.5);
    color: #E57373;
    background: rgba(192,57,43,0.08);
  }

  /* Empty state */
  .pv-cart .empty-icon {
    width: 100px; height: 100px;
    background: var(--cream);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
    font-size: 42px;
  }

  .pv-cart .shop-link {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px;
    background: var(--dark);
    color: var(--gold);
    border-radius: 14px;
    font-weight: 700; font-size: 15px;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 6px 24px rgba(26,24,20,0.15);
  }
  .pv-cart .shop-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 36px rgba(26,24,20,0.25);
  }

  /* Row line */
  .pv-cart .summary-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(245,237,216,0.07);
  }
  .pv-cart .summary-row:last-of-type { border-bottom: none; }

  /* Badge */
  .pv-cart .item-badge {
    display: inline-flex; align-items: center;
    padding: 3px 10px;
    background: rgba(212,168,83,0.12);
    border: 1px solid rgba(212,168,83,0.25);
    border-radius: 100px;
    font-size: 12px; font-weight: 600;
    color: #8B6914;
  }

  /* Secure badges */
  .pv-cart .trust-row {
    display: flex; align-items: center; justify-content: center; gap: 16px;
    padding-top: 20px;
    border-top: 1px solid rgba(245,237,216,0.08);
    margin-top: 20px;
  }
  .pv-cart .trust-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: rgba(245,237,216,0.35);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .pv-cart .cart-layout { flex-direction: column !important; }
    .pv-cart .summary-panel { position: static !important; }
  }
`;

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const TruckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

export default function Cart() {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const shipping = totalPrice > 999 ? 0 : 79;
  const tax = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + shipping + tax;

  return (
    <>
      <style>{styles}</style>
      <Helmet>
        <title>Shopping Cart — Payivva</title>
      </Helmet>

      <div className="pv-cart">
        {/* ── PAGE HEADER ── */}
        <div style={{ background: "var(--cream)", borderBottom: "1px solid var(--cream-deep)", padding: "36px 0 28px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
            <p className="cart-animate ca-1" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, letterSpacing: "0.05em" }}>
              Home &nbsp;/&nbsp; <span style={{ color: "var(--charcoal)", fontWeight: 500 }}>Cart</span>
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
              <div className="cart-animate ca-2">
                <h1 className="cart-serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "var(--charcoal)", lineHeight: 1.1, margin: 0 }}>
                  Your <em>Cart</em>
                </h1>
                <div className="gold-divider" />
              </div>
              {items.length > 0 && (
                <span className="item-badge cart-animate ca-3" style={{ marginBottom: 6 }}>
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 64px" }}>

          {items.length === 0 ? (
            /* ── EMPTY STATE ── */
            <div className="cart-animate ca-1" style={{ textAlign: "center", padding: "80px 24px" }}>
              <div className="empty-icon">🛒</div>
              <h2 className="cart-serif" style={{ fontSize: 26, color: "var(--charcoal)", marginBottom: 10 }}>
                Your cart is <em>empty</em>
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 28 }}>
                Looks like you haven't added anything yet.
              </p>
              <Link to="/products" className="shop-link">
                Browse Products <ArrowRight />
              </Link>
            </div>
          ) : (
            /* ── CART LAYOUT ── */
            <div className="cart-layout" style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>

              {/* LEFT — Items */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Items header row */}
                <div className="cart-animate ca-1" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </p>
                  <button
                    onClick={clearCart}
                    style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 12, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", padding: 0 }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#C0392B"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                  >
                    <TrashIcon /> Remove all
                  </button>
                </div>

                {/* Cart Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {items.map((item, i) => (
                    <div
                      key={item.id}
                      className="cart-card cart-animate"
                      style={{ animationDelay: `${0.1 + i * 0.07}s`, opacity: 0, animationFillMode: "forwards" }}
                    >
                      <CartItem item={item} />
                    </div>
                  ))}
                </div>

                {/* Continue shopping */}
                <div className="cart-animate ca-3" style={{ marginTop: 24 }}>
                  <Link
                    to="/products"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 13, fontWeight: 500, textDecoration: "none", borderBottom: "1px solid rgba(138,128,112,0.3)", paddingBottom: 2 }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--charcoal)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "rgba(138,128,112,0.3)"; }}
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* RIGHT — Summary */}
              <div style={{ width: 320, flexShrink: 0 }} className="cart-animate ca-2">
                <div className="summary-panel">
                  <h2 className="cart-serif" style={{ color: "var(--cream)", fontSize: 20, marginBottom: 24 }}>
                    Order <em>Summary</em>
                  </h2>

                  {/* Rows */}
                  <div style={{ marginBottom: 20 }}>
                    <div className="summary-row">
                      <span style={{ color: "rgba(245,237,216,0.55)", fontSize: 14 }}>Subtotal</span>
                      <span style={{ color: "var(--cream)", fontWeight: 600, fontSize: 14 }}>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="summary-row">
                      <span style={{ color: "rgba(245,237,216,0.55)", fontSize: 14 }}>Shipping</span>
                      {shipping === 0 ? (
                        <span style={{ color: "#62D9A4", fontWeight: 600, fontSize: 13 }}>FREE</span>
                      ) : (
                        <span style={{ color: "var(--cream)", fontWeight: 600, fontSize: 14 }}>{formatPrice(shipping)}</span>
                      )}
                    </div>
                    <div className="summary-row">
                      <span style={{ color: "rgba(245,237,216,0.55)", fontSize: 14 }}>Tax (5%)</span>
                      <span style={{ color: "var(--cream)", fontWeight: 600, fontSize: 14 }}>{formatPrice(tax)}</span>
                    </div>
                  </div>

                  {/* Free shipping nudge */}
                  {shipping > 0 && (
                    <div style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 20 }}>
                      <p style={{ color: "var(--gold)", fontSize: 12, fontWeight: 500, margin: 0 }}>
                        Add {formatPrice(999 - totalPrice)} more for free shipping!
                      </p>
                    </div>
                  )}

                  {/* Total */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: "1px solid rgba(245,237,216,0.12)", borderBottom: "1px solid rgba(245,237,216,0.12)", marginBottom: 24 }}>
                    <span className="cart-serif" style={{ color: "var(--cream)", fontSize: 18 }}>Total</span>
                    <span className="cart-serif" style={{ color: "var(--gold)", fontSize: 24, fontWeight: 900 }}>{formatPrice(grandTotal)}</span>
                  </div>

                  {/* CTA */}
                  <Link
                    to={isAuthenticated ? "/checkout" : "/login"}
                    className="btn-primary"
                  >
                    {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
                    <ArrowRight />
                  </Link>

                  <div style={{ height: 10 }} />

                  <button className="btn-ghost" onClick={clearCart}>
                    <TrashIcon /> Clear Cart
                  </button>

                  {/* Trust badges */}
                  <div className="trust-row">
                    <div className="trust-item"><ShieldIcon /> Secure</div>
                    <div className="trust-item"><TruckIcon /> Fast Delivery</div>
                    <div className="trust-item"><RefreshIcon /> Easy Returns</div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}