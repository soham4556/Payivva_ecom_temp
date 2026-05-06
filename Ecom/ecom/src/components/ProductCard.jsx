import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { truncateText } from "../utils/helpers";

/* ── Indian Rupee formatter (matches dashboard) ── */
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pv-card {
    --gold: #D4A853;
    --gold-light: #F0C97A;
    --dark: #1A1814;
    --charcoal: #2C2820;
    --cream: #F5EDD8;
    --muted: #8A8070;
    --surface: #FFFCF5;
    --danger: #C0392B;
  }

  .pv-card .pc-root {
    background: #fff;
    border: 1px solid rgba(44,40,32,0.08);
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: all 0.35s cubic-bezier(.22,1,.36,1);
    font-family: 'DM Sans', sans-serif;
    position: relative;
  }
  .pv-card .pc-root:hover {
    box-shadow: 0 16px 48px rgba(26,24,20,0.12);
    transform: translateY(-4px);
    border-color: rgba(212,168,83,0.3);
  }
  .pv-card .pc-root::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
    opacity: 0; transition: opacity 0.35s; z-index: 1;
  }
  .pv-card .pc-root:hover::before { opacity: 1; }

  /* Image */
  .pv-card .pc-img-wrap {
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    background: var(--surface);
  }
  .pv-card .pc-img-wrap img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.55s cubic-bezier(.22,1,.36,1);
  }
  .pv-card .pc-root:hover .pc-img-wrap img { transform: scale(1.07); }

  /* Out of stock overlay */
  .pv-card .pc-oos {
    position: absolute; inset: 0;
    background: rgba(26,24,20,0.62);
    backdrop-filter: blur(3px);
    display: flex; align-items: center; justify-content: center;
  }
  .pv-card .pc-oos span {
    background: var(--danger);
    color: #fff;
    padding: 5px 16px;
    border-radius: 100px;
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.05em;
    font-family: 'DM Sans', sans-serif;
  }

  /* Body */
  .pv-card .pc-body {
    padding: 18px 20px 20px;
    display: flex; flex-direction: column; flex: 1;
  }
  .pv-card .pc-name {
    font-family: 'Playfair Display', serif;
    font-size: 15px; font-weight: 700;
    color: var(--charcoal);
    margin: 0 0 6px;
    line-height: 1.25;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-decoration: none;
    transition: color 0.2s;
  }
  .pv-card .pc-name:hover { color: var(--gold); }

  .pv-card .pc-desc {
    font-size: 12px; color: var(--muted);
    line-height: 1.6; margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Price row */
  .pv-card .pc-price-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 14px;
  }
  .pv-card .pc-price {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 900;
    color: var(--charcoal);
  }
  .pv-card .pc-price-sym {
    font-size: 13px; font-weight: 600;
    color: var(--gold); margin-right: 1px;
    font-family: 'DM Sans', sans-serif;
  }
  .pv-card .pc-stock-badge {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: #166534; background: rgba(46,204,113,0.1);
    padding: 3px 9px; border-radius: 100px;
  }

  /* CTA button */
  .pv-card .pc-btn {
    margin-top: 14px;
    width: 100%;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 18px;
    background: var(--dark); color: var(--gold);
    border: none; border-radius: 14px;
    font-weight: 700; font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 4px 16px rgba(26,24,20,0.12);
    letter-spacing: 0.02em;
  }
  .pv-card .pc-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(26,24,20,0.22);
    background: var(--charcoal);
  }
  .pv-card .pc-btn:disabled {
    background: rgba(44,40,32,0.08);
    color: var(--muted);
    cursor: not-allowed;
    box-shadow: none;
  }
  .pv-card .pc-btn svg {
    flex-shrink: 0;
    transition: transform 0.25s;
  }
  .pv-card .pc-btn:hover:not(:disabled) svg { transform: translateX(2px); }
`;

function CartIcon() {
  return (
    <svg
      width="15"
      height="15"
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
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const imageUrl = product.image?.startsWith("http") || product.image?.startsWith("data:")
    ? product.image
    : product.image
      ? `/media/${product.image}`
      : "/placeholder.svg";


  const inStock = product.stock > 0;

  return (
    <>
      <style>{styles}</style>
      <div className="pv-card">
        <article className="pc-root">
          {/* Image */}
          <Link
            to={`/products/${product.slug}`}
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="pc-img-wrap">
              <img src={imageUrl} alt={product.name} loading="lazy" />
              {!inStock && (
                <div className="pc-oos">
                  <span>Out of Stock</span>
                </div>
              )}
            </div>
          </Link>

          {/* Body */}
          <div className="pc-body">
            <Link to={`/products/${product.slug}`} className="pc-name">
              {product.name}
            </Link>
            <p className="pc-desc">{truncateText(product.description, 80)}</p>

            <div className="pc-price-row">
              <p className="pc-price">
                <span className="pc-price-sym">₹</span>
                {new Intl.NumberFormat("en-IN").format(product.price)}
              </p>
              {inStock && <span className="pc-stock-badge">In Stock</span>}
            </div>

            <button
              className="pc-btn"
              onClick={() => addToCart(product)}
              disabled={!inStock}
            >
              <CartIcon />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </article>
      </div>
    </>
  );
}
