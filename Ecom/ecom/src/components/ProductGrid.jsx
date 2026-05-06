import ProductCard from "./ProductCard";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pv-grid {
    --gold: #D4A853;
    --dark: #1A1814;
    --charcoal: #2C2820;
    --muted: #8A8070;
    --surface: #FFFCF5;
  }

  @keyframes pg-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  @keyframes pg-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pv-grid .pg-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  @media (max-width: 1280px) { .pv-grid .pg-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 900px)  { .pv-grid .pg-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 520px)  { 
    .pv-grid .pg-grid { 
      grid-template-columns: repeat(2, 1fr); 
      gap: 12px;
    } 
  }


  /* Staggered card entrance */
  .pv-grid .pg-item {
    animation: pg-fadeUp 0.45s ease both;
  }

  /* Skeleton card */
  .pv-grid .pg-skel {
    background: #fff;
    border: 1px solid rgba(44,40,32,0.07);
    border-radius: 20px;
    overflow: hidden;
  }
  .pv-grid .pg-skel-img {
    aspect-ratio: 1 / 1;
    background: linear-gradient(90deg, #f0ebe0 25%, #e8e0cf 50%, #f0ebe0 75%);
    background-size: 600px 100%;
    animation: pg-shimmer 1.5s ease-in-out infinite;
  }
  .pv-grid .pg-skel-body {
    padding: 18px 20px 20px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .pv-grid .pg-skel-line {
    border-radius: 8px;
    background: linear-gradient(90deg, #f0ebe0 25%, #e8e0cf 50%, #f0ebe0 75%);
    background-size: 600px 100%;
    animation: pg-shimmer 1.5s ease-in-out infinite;
  }

  /* Empty state */
  .pv-grid .pg-empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 80px 24px;
    font-family: 'DM Sans', sans-serif;
  }
  .pv-grid .pg-empty-icon {
    width: 80px; height: 80px;
    border-radius: 50%;
    background: rgba(212,168,83,0.1);
    border: 1.5px solid rgba(212,168,83,0.2);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
  }
  .pv-grid .pg-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700;
    color: var(--charcoal); margin: 0 0 8px;
    font-style: italic;
  }
  .pv-grid .pg-empty-sub {
    font-size: 13px; color: var(--muted); margin: 0;
  }
`;

function BagIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D4A853"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="pg-skel">
      <div className="pg-skel-img" />
      <div className="pg-skel-body">
        <div className="pg-skel-line" style={{ height: 15, width: "70%" }} />
        <div className="pg-skel-line" style={{ height: 11, width: "100%" }} />
        <div className="pg-skel-line" style={{ height: 11, width: "80%" }} />
        <div
          className="pg-skel-line"
          style={{ height: 24, width: "40%", marginTop: 4 }}
        />
        <div
          className="pg-skel-line"
          style={{ height: 42, width: "100%", marginTop: 2, borderRadius: 14 }}
        />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading }) {
  return (
    <>
      <style>{styles}</style>
      <div className="pv-grid">
        {loading ? (
          <div className="pg-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : !products?.length ? (
          <div className="pg-empty">
            <div className="pg-empty-icon">
              <BagIcon />
            </div>
            <h3 className="pg-empty-title">No products found</h3>
            <p className="pg-empty-sub">Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div className="pg-grid">
            {products.map((product, i) => (
              <div
                key={product.id}
                className="pg-item"
                style={{
                  animationDelay: `${i * 0.06}s`,
                  opacity: 0,
                  animationFillMode: "forwards",
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
