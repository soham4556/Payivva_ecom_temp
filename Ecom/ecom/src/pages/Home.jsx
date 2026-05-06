import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  HiShieldCheck,
  HiTruck,
  HiCurrencyDollar,
  HiRefresh,
  HiArrowRight,
} from "react-icons/hi";
import ProductGrid from "../components/ProductGrid";
import productService from "../services/productService";

/* ─── tiny CSS-in-JS for keyframes ─── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --gold: #D4A853;
    --gold-light: #F0C97A;
    --dark: #0D0C0A;
    --dark-card: #141310;
    --dark-border: rgba(212,168,83,0.15);
    --cream: #F5EDD8;
    --muted: #8A8070;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(212,168,83,0.5); }
    70%  { transform: scale(1);    box-shadow: 0 0 0 10px rgba(212,168,83,0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(212,168,83,0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }

  .hero-title { font-family: 'Playfair Display', serif; }
  .body-font  { font-family: 'DM Sans', sans-serif; }

  .animate-fade-up { animation: fadeUp 0.7s ease forwards; }
  .animate-fade-in { animation: fadeIn 0.7s ease forwards; }
  .delay-1 { animation-delay: 0.1s; opacity: 0; }
  .delay-2 { animation-delay: 0.25s; opacity: 0; }
  .delay-3 { animation-delay: 0.4s; opacity: 0; }
  .delay-4 { animation-delay: 0.55s; opacity: 0; }

  .gold-text {
    background: linear-gradient(135deg, #D4A853 0%, #F0C97A 50%, #D4A853 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  .ticker-track { animation: ticker 28s linear infinite; }
  .ticker-track:hover { animation-play-state: paused; }

  .card-hover {
    transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease, border-color 0.35s ease;
  }
  .card-hover:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,168,83,0.35);
  }

  .stat-float { animation: float 4s ease-in-out infinite; }
  .stat-float:nth-child(2) { animation-delay: 1s; }
  .stat-float:nth-child(3) { animation-delay: 2s; }

  .search-glow:focus-within {
    box-shadow: 0 0 0 2px rgba(212,168,83,0.5), 0 8px 32px rgba(0,0,0,0.4);
  }

  .cat-chip {
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    position: relative; overflow: hidden;
  }
  .cat-chip::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(212,168,83,0.15), rgba(240,201,122,0.1));
    opacity: 0;
    transition: opacity 0.3s;
  }
  .cat-chip:hover::before { opacity: 1; }
  .cat-chip:hover {
    border-color: rgba(212,168,83,0.6) !important;
    transform: translateY(-3px) scale(1.03);
  }

  .pulse-dot { animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite; }
`;

const TICKER_ITEMS = [
  "✦ Free shipping on orders over ₹999",
  "✦ 10,000+ verified vendors",
  "✦ 30-day easy returns",
  "✦ Secure encrypted payments",
  "✦ New arrivals daily",
  "✦ Exclusive vendor deals",
  "✦ Free shipping on orders over ₹999",
  "✦ 10,000+ verified vendors",
  "✦ 30-day easy returns",
  "✦ Secure encrypted payments",
  "✦ New arrivals daily",
  "✦ Exclusive vendor deals",
];

const FEATURES = [
  {
    icon: HiShieldCheck,
    title: "100% Secure",
    desc: "SSL encrypted end-to-end. Your payment data never leaves our vault.",
    accent: "#4F9EFF",
  },
  {
    icon: HiTruck,
    title: "Swift Delivery",
    desc: "Live order tracking from warehouse to your doorstep.",
    accent: "#FF7B4F",
  },
  {
    icon: HiCurrencyDollar,
    title: "Best Price",
    desc: "Multi-vendor competition means you always win on price.",
    accent: "#D4A853",
  },
  {
    icon: HiRefresh,
    title: "Easy Returns",
    desc: "No questions asked. Return within 30 days, refund in 48h.",
    accent: "#62D9A4",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productService.getProducts({ page_size: 8 }),
      productService.getCategories(),
    ])
      .then(([prodData, catData]) => {
        setProducts(prodData.results || prodData);
        setCategories(Array.isArray(catData) ? catData : catData.results || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{globalStyles}</style>
      <Helmet>
        <title>Payivva — Curated Marketplace</title>
        <meta
          name="description"
          content="Shop from thousands of products across multiple trusted vendors at Payivva Technologies marketplace."
        />
      </Helmet>

      {/* ── TICKER ── */}
      <div
        className="body-font"
        style={{ background: "var(--gold)", overflow: "hidden", height: 36 }}
      >
        <div
          className="ticker-track flex items-center gap-10 whitespace-nowrap h-full"
          style={{ width: "max-content" }}
        >
          {TICKER_ITEMS.map((item, i) => (
            <span
              key={i}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#0D0C0A",
                letterSpacing: "0.08em",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      {categories.length > 0 && (
        <section style={{ background: "var(--cream)", padding: "80px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 48,
              }}
            >
              <div>
                <p
                  className="body-font"
                  style={{
                    color: "var(--gold)",
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Browse
                </p>
                <h2
                  className="hero-title"
                  style={{
                    fontSize: "clamp(2rem, 3vw, 2.8rem)",
                    color: "var(--dark)",
                    lineHeight: 1.1,
                  }}
                >
                  Shop by
                  <br />
                  <em>Category</em>
                </h2>
              </div>
              <Link
                to="/products"
                className="body-font"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "var(--dark)",
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: "none",
                  borderBottom: "2px solid var(--gold)",
                  paddingBottom: 4,
                }}
              >
                All Categories{" "}
                <HiArrowRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 16,
              }}
            >
              {categories.slice(0, 6).map((cat, i) => {
                const emojis = ["", "", "", "", "", ""];
                // logo design
                return (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.id}`}
                    className="cat-chip body-font"
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(13,12,10,0.08)",
                      borderRadius: 20,
                      padding: "28px 16px",
                      textAlign: "center",
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        background:
                          "linear-gradient(135deg, rgba(212,168,83,0.12), rgba(240,201,122,0.06))",
                        borderRadius: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 26,
                      }}
                    >
                      {emojis[i % emojis.length]}
                    </div>
                    <div>
                      <p
                        style={{
                          color: "var(--dark)",
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {cat.name}
                      </p>
                      <p
                        style={{
                          color: "var(--muted)",
                          fontSize: 11,
                          marginTop: 2,
                        }}
                      >
                        {cat.product_count || "View all"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ background: "#FAF6EE", padding: "80px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 48,
            }}
          >
            <div>
              <p
                className="body-font"
                style={{
                  color: "var(--gold)",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Handpicked for you
              </p>
              <h2
                className="hero-title"
                style={{
                  fontSize: "clamp(2rem, 3vw, 2.8rem)",
                  color: "var(--dark)",
                  lineHeight: 1.1,
                }}
              >
                Featured
                <br />
                <em>Products</em>
              </h2>
            </div>
            <Link
              to="/products"
              className="body-font"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "var(--dark)",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                borderBottom: "2px solid var(--gold)",
                paddingBottom: 4,
              }}
            >
              View All <HiArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>
          <ProductGrid products={products} loading={loading} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        style={{
          background: "var(--dark)",
          padding: "80px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,168,83,0.05) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p
              className="body-font"
              style={{
                color: "var(--gold)",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Our Promise
            </p>
            <h2
              className="hero-title"
              style={{
                fontSize: "clamp(2rem, 3vw, 2.8rem)",
                color: "var(--cream)",
              }}
            >
              Why Payivva?
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
            }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="card-hover body-font"
                style={{
                  background: "#141310",
                  border: "1px solid rgba(212,168,83,0.1)",
                  borderRadius: 24,
                  padding: 36,
                  cursor: "default",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: `${f.accent}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  <f.icon style={{ width: 24, height: 24, color: f.accent }} />
                </div>
                <h3
                  style={{
                    color: "var(--cream)",
                    fontWeight: 700,
                    fontSize: 17,
                    marginBottom: 10,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background: "var(--cream)", padding: "80px 24px" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            background: "var(--dark)",
            borderRadius: 32,
            padding: "clamp(40px, 6vw, 80px) clamp(32px, 6vw, 80px)",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: 48,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 40px 100px rgba(0,0,0,0.15)",
          }}
        >
          {/* Decorative circle */}
          <div
            style={{
              position: "absolute",
              right: -80,
              top: -80,
              width: 320,
              height: 320,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(212,168,83,0.12) 0%, transparent 70%)",
            }}
          />
          <div style={{ position: "relative" }}>
            <p
              className="body-font"
              style={{
                color: "var(--gold)",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              For Vendors
            </p>
            <h2
              className="hero-title"
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                color: "var(--cream)",
                marginBottom: 16,
                lineHeight: 1.1,
              }}
            >
              Ready to Start
              <br />
              <em>Selling?</em>
            </h2>
            <p
              className="body-font"
              style={{
                color: "var(--muted)",
                fontSize: 16,
                maxWidth: 440,
                lineHeight: 1.7,
              }}
            >
              Join 3,000+ vendors already growing their business on Payivva. Set
              up your store in under 5 minutes.
            </p>
          </div>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <Link
              to="/register"
              className="body-font"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: "var(--gold)",
                color: "#0D0C0A",
                padding: "16px 32px",
                borderRadius: 16,
                fontWeight: 700,
                fontSize: 16,
                textDecoration: "none",
                whiteSpace: "nowrap",
                boxShadow: "0 8px 32px rgba(212,168,83,0.35)",
                transition: "all 0.3s cubic-bezier(.22,1,.36,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 60px rgba(212,168,83,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(212,168,83,0.35)";
              }}
            >
              Get Started Free
              <HiArrowRight style={{ width: 18, height: 18 }} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
