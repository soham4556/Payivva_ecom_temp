import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ProductGrid from "../components/ProductGrid";
import productService from "../services/productService";

/* ── Injected styles ── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pf {
    --gold: #D4A853;
    --gold-light: #F0C97A;
    --dark: #1A1814;
    --cream: #F5EDD8;
    --cream-deep: #EDE3CC;
    --charcoal: #2C2820;
    --muted: #8A8070;
    --surface: #FFFCF5;
    font-family: 'DM Sans', sans-serif;
  }
  .pf .pf-serif { font-family: 'Playfair Display', serif; }

  @keyframes pf-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pf .pf-anim   { animation: pf-fadeUp 0.45s ease both; }
  .pf .pf-a1 { animation-delay: 0.04s; }
  .pf .pf-a2 { animation-delay: 0.1s; }
  .pf .pf-a3 { animation-delay: 0.17s; }
  .pf .pf-a4 { animation-delay: 0.24s; }

  /* ── HERO HEADER ── */
  .pf .pf-hero {
    background: var(--cream);
    border-bottom: 1px solid var(--cream-deep);
    padding: 44px 0 36px;
  }
  .pf .pf-hero-inner {
    max-width: 1280px; margin: 0 auto; padding: 0 28px;
  }
  .pf .pf-breadcrumb {
    font-size: 12px; color: var(--muted);
    margin: 0 0 14px; letter-spacing: 0.04em;
  }
  .pf .pf-breadcrumb span { color: var(--charcoal); font-weight: 600; }
  .pf .pf-hero-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 20px;
  }
  .pf .pf-page-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    color: var(--charcoal);
    line-height: 1.1;
    margin: 0;
  }
  .pf .pf-gold-divider {
    width: 40px; height: 3px;
    background: var(--gold); border-radius: 2px; margin-top: 10px;
  }

  /* ── SEARCH ── */
  .pf .pf-search-wrap {
    position: relative; display: flex; align-items: center;
    min-width: 230px;
  }
  .pf .pf-search-icon {
    position: absolute; left: 14px; color: var(--muted); pointer-events: none;
  }
  .pf .pf-search-input {
    width: 100%;
    padding: 10px 40px 10px 42px;
    border: 1.5px solid rgba(44,40,32,0.12);
    border-radius: 13px;
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    color: var(--charcoal); background: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .pf .pf-search-input::placeholder { color: var(--muted); }
  .pf .pf-search-input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212,168,83,0.15);
  }
  .pf .pf-search-clear {
    position: absolute; right: 12px;
    background: none; border: none; cursor: pointer;
    color: var(--muted); display: flex; padding: 2px;
    transition: color 0.2s;
  }
  .pf .pf-search-clear:hover { color: var(--charcoal); }

  /* ── SORT SELECT ── */
  .pf .pf-select {
    appearance: none; -webkit-appearance: none;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A8070' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 14px center;
    padding: 10px 40px 10px 16px;
    border: 1.5px solid rgba(44,40,32,0.12);
    border-radius: 13px;
    font-size: 13px; font-weight: 500;
    color: var(--charcoal);
    cursor: pointer; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .pf .pf-select:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212,168,83,0.15);
  }

  /* ── MAIN CONTENT ── */
  .pf .pf-main {
    background: var(--surface);
    min-height: 60vh;
  }
  .pf .pf-main-inner {
    max-width: 1280px; margin: 0 auto; padding: 36px 28px 72px;
  }

  /* ── CATEGORY PILLS ── */
  .pf .pf-cats-scroll {
    display: flex; gap: 8px;
    overflow-x: auto; padding-bottom: 4px;
    scrollbar-width: none;
  }
  .pf .pf-cats-scroll::-webkit-scrollbar { display: none; }
  .pf .pf-cat-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: 100px;
    border: 1.5px solid rgba(44,40,32,0.12);
    background: #fff; color: var(--charcoal);
    font-size: 13px; font-weight: 500;
    cursor: pointer; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.25s cubic-bezier(.22,1,.36,1);
  }
  .pf .pf-cat-pill:hover {
    border-color: var(--gold); color: var(--dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(212,168,83,0.2);
  }
  .pf .pf-cat-pill.active {
    background: var(--dark); border-color: var(--dark);
    color: var(--gold);
    box-shadow: 0 4px 20px rgba(26,24,20,0.25);
  }

  /* ── FILTER BAR ── */
  .pf .pf-filter-bar {
    display: flex; align-items: center; gap: 10px;
    flex-wrap: wrap; margin-bottom: 28px;
  }
  .pf .pf-count {
    font-size: 13px; color: var(--muted); font-weight: 500;
  }
  .pf .pf-filter-tag {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px 4px 14px;
    background: rgba(212,168,83,0.1);
    border: 1px solid rgba(212,168,83,0.28);
    border-radius: 100px;
    font-size: 12px; font-weight: 600; color: #8B6914;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.2s;
  }
  .pf .pf-filter-tag:hover { background: rgba(212,168,83,0.2); }
  .pf .pf-clear-all {
    font-size: 12px; color: var(--muted);
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    text-decoration: underline; padding: 0;
    transition: color 0.2s;
  }
  .pf .pf-clear-all:hover { color: var(--charcoal); }

  /* Separator */
  .pf .pf-sep {
    height: 1px;
    background: linear-gradient(to right, var(--cream-deep), transparent);
    margin-bottom: 36px;
  }

  /* ── EMPTY STATE ── */
  .pf .pf-empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 80px 24px;
  }
  .pf .pf-empty-icon {
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(212,168,83,0.08);
    border: 1.5px solid rgba(212,168,83,0.2);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
  }
  .pf .pf-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; font-style: italic;
    color: var(--charcoal); margin: 0 0 8px;
  }
  .pf .pf-empty-sub {
    font-size: 14px; color: var(--muted); margin: 0 0 24px;
  }
  .pf .btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 28px; background: var(--dark); color: var(--gold);
    border: none; border-radius: 14px;
    font-weight: 700; font-size: 14px; font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 4px 20px rgba(26,24,20,0.15);
  }
  .pf .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(26,24,20,0.25);
  }
`;

/* ── Sort options ── */
const SORT_OPTIONS = [
  { value: "",           label: "Sort: Recommended" },
  { value: "-created_at",label: "Newest First" },
  { value: "price",      label: "Price: Low → High" },
  { value: "-price",     label: "Price: High → Low" },
  { value: "name",       label: "Name A–Z" },
];

/* ── Icons ── */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pf-search-icon">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);
const XIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);
const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const SearchEmptyIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    <path d="M8 11h6M11 8v6"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [sortBy, setSortBy]       = useState("");
  const [localSearch, setLocalSearch] = useState("");

  const search       = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category");

  useEffect(() => { setLocalSearch(search); }, [search]);

  useEffect(() => {
    productService
      .getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : data.results || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;

    let finalCategoryId = null;
    if (categoryParam) {
      if (!isNaN(categoryParam)) {
        finalCategoryId = Number(categoryParam);
      } else if (categories.length > 0) {
        const found = categories.find((c) => c.name.toLowerCase() === categoryParam.toLowerCase());
        if (found) finalCategoryId = found.id;
      }
    }
    if (finalCategoryId) params.category = finalCategoryId;
    if (sortBy) params.ordering = sortBy;

    productService
      .getProducts(params)
      .then((data) => setProducts(data.results || data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, categoryParam, sortBy, categories]);

  const selectedCatId = categoryParam && !isNaN(categoryParam)
    ? Number(categoryParam)
    : categories.find((c) => c.name.toLowerCase() === categoryParam?.toLowerCase())?.id;

  const selectedCatName = categories.find((c) => c.id === selectedCatId)?.name;

  const handleCategorySelect = (catId) => {
    const p = new URLSearchParams(searchParams);
    if (catId) p.set("category", catId); else p.delete("category");
    setSearchParams(p);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (localSearch.trim()) p.set("search", localSearch.trim()); else p.delete("search");
    setSearchParams(p);
  };

  const clearSearch   = () => { setLocalSearch(""); const p = new URLSearchParams(searchParams); p.delete("search"); setSearchParams(p); };
  const clearCategory = () => handleCategorySelect(null);
  const clearAll      = () => { clearSearch(); clearCategory(); setSortBy(""); };

  const hasFilters  = search || selectedCatId;
  const pageTitle   = search ? `"${search}"` : selectedCatName ?? "All Products";

  return (
    <>
      <style>{styles}</style>
      <Helmet>
        <title>{pageTitle} — Payivva Marketplace</title>
        <meta name="description" content="Browse all products available on Payivva multi-vendor marketplace." />
      </Helmet>

      <div className="pf">
        {/* ── HERO HEADER ── */}
        <div className="pf-hero">
          <div className="pf-hero-inner">
            <p className="pf-breadcrumb pf-anim">
              Home &nbsp;/&nbsp; <span>{pageTitle}</span>
            </p>

            <div className="pf-hero-row">
              {/* Title */}
              <div className="pf-anim pf-a1">
                <h1 className="pf-page-title">
                  {search ? (
                    <>Results for <em style={{ color: "var(--gold)" }}>"{search}"</em></>
                  ) : selectedCatName ? (
                    <>{selectedCatName}</>
                  ) : (
                    <>All <em>Products</em></>
                  )}
                </h1>
                <div className="pf-gold-divider" />
              </div>

              {/* Search + Sort */}
              <div className="pf-anim pf-a2" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <form onSubmit={handleSearchSubmit}>
                  <div className="pf-search-wrap">
                    <SearchIcon />
                    <input
                      type="text"
                      className="pf-search-input"
                      placeholder="Search products..."
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                    />
                    {localSearch && (
                      <button type="button" className="pf-search-clear" onClick={clearSearch}>
                        <XIcon size={13} />
                      </button>
                    )}
                  </div>
                </form>

                <select className="pf-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN ── */}
        <div className="pf-main">
          <div className="pf-main-inner">

            {/* Category pills */}
            {categories.length > 0 && (
              <div className="pf-anim pf-a2" style={{ marginBottom: 28 }}>
                <div className="pf-cats-scroll">
                  <button
                    className={`pf-cat-pill${!selectedCatId ? " active" : ""}`}
                    onClick={() => handleCategorySelect(null)}
                  >
                    <FilterIcon /> All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`pf-cat-pill${selectedCatId === cat.id ? " active" : ""}`}
                      onClick={() => handleCategorySelect(cat.id)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filter bar */}
            <div className="pf-filter-bar pf-anim pf-a3">
              {!loading && (
                <span className="pf-count">
                  {products.length} {products.length === 1 ? "product" : "products"} found
                </span>
              )}
              {search && (
                <button className="pf-filter-tag" onClick={clearSearch}>
                  Search: {search} <XIcon size={11} />
                </button>
              )}
              {selectedCatName && (
                <button className="pf-filter-tag" onClick={clearCategory}>
                  {selectedCatName} <XIcon size={11} />
                </button>
              )}
              {hasFilters && (
                <button className="pf-clear-all" onClick={clearAll}>Clear all</button>
              )}
            </div>

            {/* Separator */}
            <div className="pf-sep" />

            {/* Grid or empty */}
            {!loading && products.length === 0 ? (
              <div className="pf-empty pf-anim pf-a4">
                <div className="pf-empty-icon">
                  <SearchEmptyIcon />
                </div>
                <h3 className="pf-empty-title">No products found</h3>
                <p className="pf-empty-sub">Try adjusting your filters or search term.</p>
                <button className="btn-primary" onClick={clearAll}>
                  Clear Filters <ArrowIcon />
                </button>
              </div>
            ) : (
              <div className="pf-anim pf-a4">
                <ProductGrid products={products} loading={loading} />
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}