import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";
import productService from "../services/productService";

/* ── Indian Rupee formatter ── */
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pv-pd {
    --gold: #D4A853;
    --gold-light: #F0C97A;
    --dark: #1A1814;
    --charcoal: #2C2820;
    --cream: #F5EDD8;
    --cream-deep: #EDE3CC;
    --muted: #8A8070;
    --surface: #FFFCF5;
    --danger: #C0392B;
    --success: #2ECC71;
    font-family: 'DM Sans', sans-serif;
    background: var(--surface);
    min-height: 100vh;
  }

  @keyframes pd-fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pd-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  @keyframes pd-check {
    0%   { transform: scale(0.6); opacity: 0; }
    60%  { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes pd-spin { to { transform: rotate(360deg); } }

  .pv-pd .pd-anim  { animation: pd-fadeUp 0.5s ease both; }
  .pv-pd .pd-a1 { animation-delay: 0.05s; }
  .pv-pd .pd-a2 { animation-delay: 0.12s; }
  .pv-pd .pd-a3 { animation-delay: 0.2s; }
  .pv-pd .pd-a4 { animation-delay: 0.28s; }
  .pv-pd .pd-a5 { animation-delay: 0.36s; }

  /* ── WRAPPER ── */
  .pv-pd .pd-wrap {
    max-width: 1180px; margin: 0 auto; padding: 36px 28px 80px;
  }

  /* ── BREADCRUMB ── */
  .pv-pd .pd-breadcrumb {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: var(--muted);
    margin-bottom: 36px; letter-spacing: 0.04em;
  }
  .pv-pd .pd-breadcrumb a {
    color: var(--muted); text-decoration: none;
    transition: color 0.2s;
  }
  .pv-pd .pd-breadcrumb a:hover { color: var(--gold); }
  .pv-pd .pd-breadcrumb .sep { opacity: 0.4; }
  .pv-pd .pd-breadcrumb .current { color: var(--charcoal); font-weight: 600; }

  /* ── LAYOUT ── */
  .pv-pd .pd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    align-items: start;
  }
  @media (max-width: 860px) {
    .pv-pd .pd-grid { grid-template-columns: 1fr; gap: 32px; }
  }

  /* ── IMAGE PANEL ── */
  .pv-pd .pd-img-card {
    background: #fff;
    border: 1px solid rgba(44,40,32,0.08);
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    aspect-ratio: 1 / 1;
    box-shadow: 0 8px 40px rgba(26,24,20,0.07);
  }
  .pv-pd .pd-img-card img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.6s cubic-bezier(.22,1,.36,1);
  }
  .pv-pd .pd-img-card:hover img { transform: scale(1.04); }
  .pv-pd .pd-img-card::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(26,24,20,0.04));
    pointer-events: none;
  }
  .pv-pd .pd-oos-overlay {
    position: absolute; inset: 0;
    background: rgba(26,24,20,0.55); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
  }
  .pv-pd .pd-oos-badge {
    background: var(--danger); color: #fff;
    padding: 8px 22px; border-radius: 100px;
    font-size: 13px; font-weight: 700; letter-spacing: 0.05em;
  }

  /* ── DETAILS PANEL ── */
  .pv-pd .pd-cat-badge {
    display: inline-flex; align-items: center;
    padding: 4px 14px;
    background: rgba(212,168,83,0.1);
    border: 1px solid rgba(212,168,83,0.25);
    border-radius: 100px;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #8B6914;
    margin-bottom: 14px;
  }
  .pv-pd .pd-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.7rem, 3vw, 2.4rem);
    font-weight: 900; color: var(--charcoal);
    line-height: 1.15; margin: 0 0 6px;
  }
  .pv-pd .pd-gold-divider {
    width: 40px; height: 3px;
    background: var(--gold); border-radius: 2px; margin-bottom: 24px;
  }
  .pv-pd .pd-price {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem; font-weight: 900;
    color: var(--charcoal); margin: 0 0 28px;
    display: flex; align-items: baseline; gap: 4px;
  }
  .pv-pd .pd-price-sym {
    font-size: 1.3rem; color: var(--gold);
    font-family: 'DM Sans', sans-serif; font-weight: 700;
  }

  /* Description */
  .pv-pd .pd-desc-block {
    padding: 32px 0;
    border-top: 1px solid rgba(44,40,32,0.06);
    border-bottom: 1px solid rgba(44,40,32,0.06);
    margin-bottom: 32px;
  }
  .pv-pd .pd-desc {
    font-size: 15px; color: var(--muted);
    line-height: 1.8; margin: 0;
    white-space: pre-line;
  }

  /* Meta row */
  .pv-pd .pd-meta {
    display: flex; align-items: center; gap: 16px;
    flex-wrap: wrap; margin-bottom: 28px;
  }
  .pv-pd .pd-stock-in {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 700; color: #166534;
  }
  .pv-pd .pd-stock-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 0 3px rgba(46,204,113,0.2);
  }
  .pv-pd .pd-stock-out {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 700; color: var(--danger);
  }
  .pv-pd .pd-stock-dot-out {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--danger);
  }
  .pv-pd .pd-policy-tag {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600; color: var(--muted);
    padding: 3px 10px;
    background: rgba(138,128,112,0.08);
    border-radius: 100px;
  }

  /* ── QUANTITY STEPPER ── */
  .pv-pd .pd-qty-row {
    display: flex; align-items: center; gap: 14px;
    flex-wrap: wrap;
  }
  .pv-pd .pd-stepper {
    display: flex; align-items: center;
    border: 1.5px solid rgba(44,40,32,0.12);
    border-radius: 14px; overflow: hidden;
    background: #fff;
  }
  .pv-pd .pd-stepper-btn {
    width: 42px; height: 48px;
    display: flex; align-items: center; justify-content: center;
    background: none; border: none; cursor: pointer;
    font-size: 18px; font-weight: 700;
    color: var(--charcoal);
    transition: background 0.2s, color 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .pv-pd .pd-stepper-btn:hover:not(:disabled) {
    background: rgba(212,168,83,0.1); color: var(--dark);
  }
  .pv-pd .pd-stepper-btn:disabled { color: #C4BAA8; cursor: not-allowed; }
  .pv-pd .pd-stepper-val {
    min-width: 44px; text-align: center;
    font-size: 15px; font-weight: 700; color: var(--charcoal);
    border-left: 1px solid rgba(44,40,32,0.08);
    border-right: 1px solid rgba(44,40,32,0.08);
    height: 48px; display: flex; align-items: center; justify-content: center;
  }

  /* ── CTA BUTTON ── */
  .pv-pd .pd-cta {
    flex: 1; min-width: 180px;
    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
    padding: 15px 28px;
    background: var(--dark); color: var(--gold);
    border: none; border-radius: 16px;
    font-weight: 700; font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 6px 24px rgba(26,24,20,0.18);
    letter-spacing: 0.02em;
  }
  .pv-pd .pd-cta:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 36px rgba(26,24,20,0.28);
  }
  .pv-pd .pd-cta:disabled { background: rgba(44,40,32,0.08); color: var(--muted); cursor: not-allowed; box-shadow: none; }
  .pv-pd .pd-cta.added {
    background: #166534; color: #fff;
    box-shadow: 0 6px 24px rgba(22,101,52,0.25);
  }
  .pv-pd .pd-check { animation: pd-check 0.35s cubic-bezier(.22,1,.36,1) both; }

  /* ── SKELETON ── */
  .pv-pd .pd-skel {
    background: linear-gradient(90deg, #f0ebe0 25%, #e8e0cf 50%, #f0ebe0 75%);
    background-size: 600px 100%;
    animation: pd-shimmer 1.5s ease-in-out infinite;
    border-radius: 12px;
  }

  /* ── NOT FOUND ── */
  .pv-pd .pd-notfound {
    text-align: center; padding: 80px 24px;
  }
  .pv-pd .pd-notfound-icon {
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(212,168,83,0.08);
    border: 1.5px solid rgba(212,168,83,0.2);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
  }
  .pv-pd .pd-notfound-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-style: italic;
    color: var(--charcoal); margin: 0 0 8px;
  }
  .pv-pd .pd-notfound-sub {
    font-size: 14px; color: var(--muted); margin: 0 0 24px;
  }
  .pv-pd .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 22px; background: #fff; color: var(--charcoal);
    border: 1.5px solid rgba(44,40,32,0.12); border-radius: 14px;
    font-weight: 600; font-size: 13px; font-family: 'DM Sans', sans-serif;
    text-decoration: none; cursor: pointer; transition: all 0.25s;
  }
  .pv-pd .btn-ghost:hover { border-color: var(--gold); background: var(--cream); }
`;

/* ── Icons ── */
const CartIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="pd-check"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const BackIcon = () => (
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
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const NotFoundIcon = () => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#D4A853"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
    <line x1="11" y1="8" x2="11" y2="11" />
    <line x1="11" y1="14" x2="11.01" y2="14" />
  </svg>
);
const ReturnIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
  </svg>
);
const SwapIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 014-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 01-4 4H3" />
  </svg>
);

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    productService
      .getProduct(slug)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const imageUrl = product?.image?.startsWith("http")
    ? product.image
    : product?.image
      ? `/media/${product.image}`
      : "/placeholder.svg";

  const inStock = product?.stock > 0;

  return (
    <>
      <style>{styles}</style>

      <div className="pv-pd">
        <div className="pd-wrap">
          {/* ── LOADING ── */}
          {loading && (
            <div>
              {/* Breadcrumb skeleton */}
              <div
                className="pd-skel"
                style={{ height: 13, width: 220, marginBottom: 36 }}
              />
              <div className="pd-grid">
                <div
                  className="pd-skel"
                  style={{ aspectRatio: "1/1", borderRadius: 24 }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    paddingTop: 8,
                  }}
                >
                  <div
                    className="pd-skel"
                    style={{ height: 22, width: "40%" }}
                  />
                  <div
                    className="pd-skel"
                    style={{ height: 48, width: "75%" }}
                  />
                  <div className="pd-skel" style={{ height: 4, width: 40 }} />
                  <div
                    className="pd-skel"
                    style={{ height: 44, width: "50%" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      padding: "20px 0",
                    }}
                  >
                    <div className="pd-skel" style={{ height: 13 }} />
                    <div className="pd-skel" style={{ height: 13 }} />
                    <div
                      className="pd-skel"
                      style={{ height: 13, width: "70%" }}
                    />
                  </div>
                  <div
                    className="pd-skel"
                    style={{ height: 54, borderRadius: 16 }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── NOT FOUND ── */}
          {!loading && !product && (
            <div className="pd-notfound pd-anim">
              <div className="pd-notfound-icon">
                <NotFoundIcon />
              </div>
              <h1 className="pd-notfound-title">Product not found</h1>
              <p className="pd-notfound-sub">
                This product may have been removed or the link is incorrect.
              </p>
              <Link to="/products" className="btn-ghost">
                <BackIcon /> Back to Products
              </Link>
            </div>
          )}

          {/* ── PRODUCT ── */}
          {!loading && product && (
            <>
              {/* Helmet */}
              <Helmet>
                <title>{product.name} — Payivva Marketplace</title>
                <meta
                  name="description"
                  content={product.description?.slice(0, 160)}
                />
              </Helmet>

              {/* Breadcrumb */}
              <nav className="pd-breadcrumb pd-anim">
                <Link to="/">Home</Link>
                <span className="sep">/</span>
                <Link to="/products">Products</Link>
                <span className="sep">/</span>
                <span className="current">{product.name}</span>
              </nav>

              <div className="pd-grid">
                {/* ── IMAGE ── */}
                <div className="pd-anim pd-a1">
                  <div className="pd-img-card">
                    <img src={imageUrl} alt={product.name} />
                    {!inStock && (
                      <div className="pd-oos-overlay">
                        <span className="pd-oos-badge">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── DETAILS ── */}
                <div>
                  {/* Category badge */}
                  <div className="pd-anim pd-a1">
                    <span className="pd-cat-badge">
                      {product.category_name || "Uncategorized"}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="pd-anim pd-a2">
                    <h1 className="pd-name">{product.name}</h1>
                    <div className="pd-gold-divider" />
                  </div>

                  {/* Price */}
                  <div className="pd-anim pd-a2">
                    <p className="pd-price">
                      <span className="pd-price-sym">₹</span>
                      {new Intl.NumberFormat("en-IN").format(product.price)}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="pd-desc-block pd-anim pd-a3">
                    <p className="pd-desc">{product.description}</p>
                  </div>

                  {/* Meta: policies */}
                  <div className="pd-meta pd-anim pd-a3">
                    {product.is_returnable && (
                      <span className="pd-policy-tag">
                        <ReturnIcon /> Returnable
                      </span>
                    )}
                    {product.is_exchangeable && (
                      <span className="pd-policy-tag">
                        <SwapIcon /> Exchangeable
                      </span>
                    )}
                  </div>

                  {/* Qty + CTA */}
                  {inStock && (
                    <div className="pd-qty-row pd-anim pd-a4">
                      <div className="pd-stepper">
                        <button
                          className="pd-stepper-btn"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                        >
                          −
                        </button>
                        <span className="pd-stepper-val">{quantity}</span>
                        <button
                          className="pd-stepper-btn"
                          onClick={() =>
                            setQuantity((q) => Math.min(product.stock, q + 1))
                          }
                          disabled={quantity >= product.stock}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className={`pd-cta${added ? " added" : ""}`}
                        onClick={handleAddToCart}
                        disabled={added}
                      >
                        {added ? (
                          <>
                            <CheckIcon /> Added to Cart
                          </>
                        ) : (
                          <>
                            <CartIcon /> Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
