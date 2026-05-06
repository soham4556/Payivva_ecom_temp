import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/helpers";
import orderService from "../services/orderService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pv-checkout {
    --gold: #D4A853;
    --gold-light: #F0C97A;
    --dark: #1A1814;
    --charcoal: #2C2820;
    --cream: #F5EDD8;
    --cream-deep: #EDE3CC;
    --muted: #8A8070;
    --surface: #FFFCF5;
    --danger: #C0392B;
    --danger-soft: #FEF2F2;
    font-family: 'DM Sans', sans-serif;
    background: var(--surface);
    min-height: 80vh;
  }

  .pv-checkout .co-serif { font-family: 'Playfair Display', serif; }

  @keyframes co-fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pv-checkout .co-anim { animation: co-fadeUp 0.5s ease both; }
  .pv-checkout .co-a1 { animation-delay: 0.05s; }
  .pv-checkout .co-a2 { animation-delay: 0.12s; }
  .pv-checkout .co-a3 { animation-delay: 0.2s; }
  .pv-checkout .co-a4 { animation-delay: 0.28s; }

  .pv-checkout .gold-divider {
    width: 40px; height: 3px;
    background: var(--gold); border-radius: 2px; margin: 10px 0 0;
  }

  /* Form card */
  .pv-checkout .form-card {
    background: #fff;
    border: 1px solid rgba(44,40,32,0.08);
    border-radius: 24px;
    padding: 36px;
  }

  /* Input styles */
  .pv-checkout .co-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .pv-checkout .co-input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid rgba(44,40,32,0.12);
    border-radius: 14px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--charcoal);
    background: #FDFBF7;
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    box-sizing: border-box;
  }
  .pv-checkout .co-input::placeholder { color: #C4BAA8; }
  .pv-checkout .co-input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212,168,83,0.15);
    background: #fff;
  }

  .pv-checkout textarea.co-input {
    resize: vertical;
    min-height: 100px;
    line-height: 1.6;
  }

  /* Step indicator */
  .pv-checkout .step-row {
    display: flex; align-items: center; gap: 0; margin-bottom: 32px;
  }
  .pv-checkout .step-dot {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; flex-shrink: 0;
  }
  .pv-checkout .step-dot.active { background: var(--dark); color: var(--gold); }
  .pv-checkout .step-dot.done   { background: var(--gold); color: var(--dark); }
  .pv-checkout .step-dot.idle   { background: rgba(44,40,32,0.08); color: var(--muted); }
  .pv-checkout .step-line { flex: 1; height: 2px; background: rgba(44,40,32,0.08); margin: 0 8px; }
  .pv-checkout .step-line.done { background: var(--gold); }
  .pv-checkout .step-label { font-size: 11px; font-weight: 600; color: var(--muted); margin-top: 4px; letter-spacing: 0.05em; }

  /* Submit button */
  .pv-checkout .btn-submit {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 16px 24px;
    background: var(--dark);
    color: var(--gold);
    border: none; border-radius: 16px;
    font-weight: 700; font-size: 16px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 6px 28px rgba(26,24,20,0.2);
    margin-top: 28px;
  }
  .pv-checkout .btn-submit:hover:not(:disabled) {
    background: var(--charcoal);
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(26,24,20,0.3);
  }
  .pv-checkout .btn-submit:disabled {
    background: #C4BAA8; color: #fff; cursor: not-allowed; box-shadow: none;
  }

  /* Spinner */
  @keyframes co-spin { to { transform: rotate(360deg); } }
  .pv-checkout .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(212,168,83,0.3);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: co-spin 0.7s linear infinite;
  }

  /* Summary panel */
  .pv-checkout .summary-panel {
    background: var(--dark);
    border-radius: 24px;
    padding: 32px;
    position: sticky;
    top: 100px;
  }

  .pv-checkout .summary-item {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 12px 0;
    border-bottom: 1px solid rgba(245,237,216,0.07);
    gap: 12px;
  }
  .pv-checkout .summary-item:last-of-type { border-bottom: none; }

  /* Error */
  .pv-checkout .error-box {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 14px 16px;
    background: var(--danger-soft);
    border: 1px solid rgba(192,57,43,0.2);
    border-radius: 14px;
    margin-bottom: 24px;
    font-size: 13px;
    color: var(--danger);
    line-height: 1.5;
  }

  /* Trust strip */
  .pv-checkout .trust-strip {
    display: flex; gap: 12px; flex-wrap: wrap;
    padding: 16px 0 0;
    margin-top: 16px;
    border-top: 1px solid rgba(245,237,216,0.08);
  }
  .pv-checkout .trust-badge {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: rgba(245,237,216,0.35); font-weight: 500;
  }

  /* Item thumb */
  .pv-checkout .item-thumb {
    width: 40px; height: 40px; border-radius: 10px;
    object-fit: cover; background: #2C2820; flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .pv-checkout .co-layout { flex-direction: column !important; }
    .pv-checkout .summary-panel { position: static !important; }
    .pv-checkout .form-card { padding: 24px !important; }
  }
`;

const LockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ArrowRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const AlertIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0, marginTop: 1 }}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ shipping_address: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const shipping = totalPrice > 999 ? 0 : 79;
  const tax = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Instead of creating order directly, navigate to payment page
    const orderData = {
      items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      shipping_address: form.shipping_address,
      phone: form.phone,
      total_price: grandTotal,
    };

    setTimeout(() => {
      setLoading(false);
      navigate("/payment", { state: { orderData, grandTotal } });
    }, 800);
  };

  return (
    <>
      <style>{styles}</style>
      <Helmet>
        <title>Checkout — Payivva</title>
      </Helmet>

      <div className="pv-checkout">
        {/* ── HEADER ── */}
        <div
          style={{
            background: "var(--cream)",
            borderBottom: "1px solid var(--cream-deep)",
            padding: "36px 0 28px",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
            <p
              className="co-anim co-a1"
              style={{
                fontSize: 12,
                color: "var(--muted)",
                marginBottom: 10,
                letterSpacing: "0.05em",
              }}
            >
              <Link
                to="/cart"
                style={{ color: "var(--muted)", textDecoration: "none" }}
              >
                Cart
              </Link>
              &nbsp;/&nbsp;
              <span style={{ color: "var(--charcoal)", fontWeight: 500 }}>
                Checkout
              </span>
            </p>
            <div className="co-anim co-a2">
              <h1
                className="co-serif"
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                  color: "var(--charcoal)",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Secure <em>Checkout</em>
              </h1>
              <div className="gold-divider" />
            </div>
          </div>
        </div>

        {/* ── MAIN ── */}
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "40px 24px 64px",
          }}
        >
          {/* Step indicator */}
          <div className="co-anim co-a2" style={{ marginBottom: 36 }}>
            <div className="step-row">
              <div style={{ textAlign: "center" }}>
                <div className="step-dot done">
                  <CheckIcon />
                </div>
                <p className="step-label">Cart</p>
              </div>
              <div className="step-line done" />
              <div style={{ textAlign: "center" }}>
                <div className="step-dot active">2</div>
                <p className="step-label">Shipping</p>
              </div>
              <div className="step-line" />
              <div style={{ textAlign: "center" }}>
                <div className="step-dot idle">3</div>
                <p className="step-label">Confirm</p>
              </div>
            </div>
          </div>

          <div
            className="co-layout"
            style={{ display: "flex", gap: 28, alignItems: "flex-start" }}
          >
            {/* ── FORM ── */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="form-card co-anim co-a3">
                <h2
                  className="co-serif"
                  style={{
                    fontSize: 20,
                    color: "var(--charcoal)",
                    marginBottom: 6,
                  }}
                >
                  Shipping <em>Details</em>
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--muted)",
                    marginBottom: 28,
                  }}
                >
                  Where should we deliver your order?
                </p>

                {error && (
                  <div className="error-box">
                    <AlertIcon />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 22,
                    }}
                  >
                    {/* Address */}
                    <div>
                      <label className="co-label">Shipping Address</label>
                      <textarea
                        required
                        rows={3}
                        className="co-input"
                        value={form.shipping_address}
                        onChange={(e) =>
                          setForm({ ...form, shipping_address: e.target.value })
                        }
                        placeholder="House / Flat no., Street, Area, City, State, PIN"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="co-label">Phone Number</label>
                      <div style={{ position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: 16,
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--muted)",
                            borderRight: "1.5px solid rgba(44,40,32,0.12)",
                            paddingRight: 12,
                          }}
                        >
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          className="co-input"
                          style={{ paddingLeft: 64 }}
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          placeholder="98765 43210"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security note */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 24,
                      padding: "12px 16px",
                      background: "rgba(212,168,83,0.07)",
                      borderRadius: 12,
                      border: "1px solid rgba(212,168,83,0.15)",
                    }}
                  >
                    <ShieldIcon
                      style={{ color: "var(--gold)", flexShrink: 0 }}
                    />
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--muted)",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      Your information is encrypted and secure. We never share
                      your data.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner" /> Placing Order...
                      </>
                    ) : (
                      <>
                        <LockIcon /> Place Order &nbsp;·&nbsp;{" "}
                        {formatPrice(grandTotal)}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* ── SUMMARY ── */}
            <div
              style={{ width: 320, flexShrink: 0 }}
              className="co-anim co-a4"
            >
              <div className="summary-panel">
                <h2
                  className="co-serif"
                  style={{
                    color: "var(--cream)",
                    fontSize: 20,
                    marginBottom: 6,
                  }}
                >
                  Order <em>Summary</em>
                </h2>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(245,237,216,0.35)",
                    marginBottom: 20,
                  }}
                >
                  {items.length} {items.length === 1 ? "item" : "items"} in your
                  cart
                </p>

                {/* Items list */}
                <div style={{ marginBottom: 8 }}>
                  {items.map((item) => (
                    <div key={item.id} className="summary-item">
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          minWidth: 0,
                        }}
                      >
                        <img
                          src={item.image?.startsWith("http") || item.image?.startsWith("data:") ? item.image : (item.image ? `/media/${item.image}` : "https://via.placeholder.com/40")}
                          alt={item.name}
                          className="item-thumb"
                        />

                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              color: "var(--cream)",
                              fontSize: 13,
                              fontWeight: 500,
                              margin: 0,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.name}
                          </p>
                          <p
                            style={{
                              color: "rgba(245,237,216,0.35)",
                              fontSize: 11,
                              margin: "2px 0 0",
                            }}
                          >
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span
                        style={{
                          color: "var(--cream)",
                          fontSize: 13,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div
                  style={{
                    borderTop: "1px solid rgba(245,237,216,0.1)",
                    paddingTop: 14,
                    marginTop: 4,
                  }}
                >
                  {[
                    { label: "Subtotal", value: formatPrice(totalPrice) },
                    {
                      label: "Shipping",
                      value: shipping === 0 ? "FREE" : formatPrice(shipping),
                      green: shipping === 0,
                    },
                    { label: "Tax (5%)", value: formatPrice(tax) },
                  ].map(({ label, value, green }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "7px 0",
                      }}
                    >
                      <span
                        style={{
                          color: "rgba(245,237,216,0.45)",
                          fontSize: 13,
                        }}
                      >
                        {label}
                      </span>
                      <span
                        style={{
                          color: green ? "#62D9A4" : "var(--cream)",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid rgba(245,237,216,0.12)",
                    marginTop: 12,
                    paddingTop: 16,
                  }}
                >
                  <span
                    className="co-serif"
                    style={{ color: "var(--cream)", fontSize: 18 }}
                  >
                    Total
                  </span>
                  <span
                    className="co-serif"
                    style={{
                      color: "var(--gold)",
                      fontSize: 24,
                      fontWeight: 900,
                    }}
                  >
                    {formatPrice(grandTotal)}
                  </span>
                </div>

                {/* Trust */}
                <div className="trust-strip">
                  {["SSL Secured", "Easy Returns", "24/7 Support"].map((t) => (
                    <div key={t} className="trust-badge">
                      <ShieldIcon /> {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
