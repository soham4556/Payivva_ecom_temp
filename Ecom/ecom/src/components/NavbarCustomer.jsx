import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiMenu,
  HiShoppingCart,
  HiUser,
  HiX,
  HiChevronDown,
  HiChevronRight,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SearchBar from "./SearchBar";
import logoImage from "../assets/logo.png";

const productLinks = [
  { to: "/products?category=cctv-cameras", label: "CCTV Cameras", icon: "📹" },
  {
    to: "/products?category=video-door-phone",
    label: "Video Door Phone",
    icon: "🚪",
  },
  {
    to: "/products?category=intercom-systems",
    label: "Intercom Systems",
    icon: "📞",
  },
  {
    to: "/products?category=biometric-devices",
    label: "Biometric Devices",
    icon: "🔏",
  },
  { to: "/products?category=epabx", label: "EPABX", icon: "☎️" },
  {
    to: "/products?category=access-control",
    label: "Access Control",
    icon: "🔐",
  },
  { to: "/products?category=fire-alarm", label: "Fire Alarm", icon: "🔔" },
  { to: "/products?category=boom-barrier", label: "Boom Barrier", icon: "🚧" },
  { to: "/products/solar-system", label: "Solar System", icon: "☀️" },
  { to: "/products?category=ups", label: "UPS", icon: "⚡" },
  {
    to: "/products?category=commercial-tv",
    label: "Commercial TV",
    icon: "📺",
  },
];

const serviceLinks = [
  { to: "/services/installation", label: "Installation", icon: "🔧" },
  { to: "/services/maintenance", label: "Maintenance", icon: "⚙️" },
  { to: "/services/amc", label: "AMC Services", icon: "📋" },
  { to: "/services/consultation", label: "Security Consultation", icon: "🛡️" },
];

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/solutions", label: "Solutions" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

/* ── Mega-dropdown component ── */
function MegaMenu({ title, items, align = "left" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="nav-link flex items-center gap-1 group"
      >
        {title}
        <HiChevronDown
          className={`transition-transform duration-300 text-[#D4AF37] ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute top-full ${align === "right" ? "right-0" : "left-0"} pt-3 transition-all duration-300 ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
        style={{ zIndex: 1000 }}
      >
        <div className="mega-panel">
          {/* glow bar */}
          <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-1" />
          <div
            className="grid grid-cols-2 gap-x-6 gap-y-1 p-4"
            style={{ minWidth: 360 }}
          >
            {items.map((item) => (
              <Link
                key={item.to || item.label}
                to={item.to}
                className={`mega-item ${item.className || ""}`}
                onClick={(e) => {
                  setOpen(false);
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile accordion section ── */
function MobileSection({ title, links, onClose }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-section">
      <button
        className="mobile-section-header"
        onClick={() => setOpen((p) => !p)}
      >
        <span>{title}</span>
        <HiChevronRight
          className={`transition-transform duration-300 text-[#D4AF37] ${open ? "rotate-90" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col gap-1 px-4 pb-3 pt-1">
          {links.map((l) =>
            l.onClick ? (
              <button
                key={l.label}
                onClick={() => {
                  l.onClick();
                  onClose();
                }}
                className="mobile-link text-left"
              >
                {l.icon && <span>{l.icon}</span>}
                {l.label}
              </button>
            ) : (
              <Link
                key={l.to}
                to={l.to}
                onClick={onClose}
                className="mobile-link"
              >
                {l.icon && <span>{l.icon}</span>}
                {l.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default function NavbarCustomer() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login", { state: { loggedOut: true } });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const accountItems = isAuthenticated
    ? [
        user?.role === "vendor"
          ? { to: "/vendor/dashboard", label: "Vendor Dashboard", icon: "📊" }
          : user?.role === "admin"
            ? { to: "/admin/dashboard", label: "Admin Dashboard", icon: "🛡️" }
            : { to: "/profile", label: "My Profile", icon: "👤" },
        {
          to: user?.role === "vendor" ? "/vendor/dashboard/orders" : "/orders",
          label: "My Orders",
          icon: "📦",
        },
        {
          label: "Logout",
          onClick: handleLogout,
          to: "#",
          icon: "🚪",
          className: "text-red-400",
        },
      ]
    : [
        { to: "/login", label: "Sign In", icon: "🔑" },
        { to: "/register", label: "Register", icon: "✨" },
      ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

        :root {
          --gold: #D4AF37;
          --gold-light: #F5E27A;
          --gold-dim: rgba(212,175,55,0.15);
          --navy: #0A0E1A;
          --navy-mid: #111827;
          --glass: rgba(10,14,26,0.85);
          --border: rgba(212,175,55,0.2);
          --text-primary: #F0EDD8;
          --text-muted: rgba(240,237,216,0.55);
          --surface: rgba(255,255,255,0.04);
        }

        .nav-font { font-family: 'Outfit', sans-serif; }
        .logo-font { font-family: 'Cinzel', serif; }

        /* ─── Header ─── */
        .nav-header {
          font-family: 'Outfit', sans-serif;
          position: sticky;
          top: 0;
          z-index: 100;
          transition: all 0.4s ease;
        }
        .nav-header.scrolled {
          background: var(--glass);
          backdrop-filter: blur(20px) saturate(1.6);
          -webkit-backdrop-filter: blur(20px) saturate(1.6);
          box-shadow: 0 4px 40px rgba(0,0,0,0.4), 0 1px 0 var(--border);
        }
        .nav-header.top {
          background: linear-gradient(180deg, rgba(10,14,26,0.98) 0%, rgba(10,14,26,0.9) 100%);
        }

        /* Gold accent line at very top */
        .nav-header::before {
          content: '';
          display: block;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, var(--gold) 30%, var(--gold-light) 50%, var(--gold) 70%, transparent 100%);
        }

        /* ─── Logo shimmer ─── */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-logo {
          background: linear-gradient(90deg, #D4AF37 0%, #FFF0A0 40%, #D4AF37 60%, #B8921E 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3.5s linear infinite;
        }

        /* ─── Nav links ─── */
        .nav-link {
          font-family: 'Outfit', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          color: var(--text-primary);
          padding: 6px 2px;
          position: relative;
          transition: color 0.25s;
          background: none;
          border: none;
          cursor: pointer;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          height: 1.5px;
          width: 0;
          background: linear-gradient(90deg, var(--gold), var(--gold-light));
          transition: width 0.3s ease;
          border-radius: 2px;
        }
        .nav-link:hover { color: var(--gold-light); }
        .nav-link:hover::after { width: 100%; }

        /* ─── Mega panel ─── */
        .mega-panel {
          background: linear-gradient(135deg, rgba(10,14,26,0.97) 0%, rgba(17,24,39,0.97) 100%);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.05);
          overflow: hidden;
        }
        .mega-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text-muted);
          transition: all 0.2s;
          text-decoration: none;
          white-space: nowrap;
        }
        .mega-item:hover {
          color: var(--gold-light);
          background: var(--gold-dim);
          transform: translateX(3px);
        }

        /* ─── Icon buttons ─── */
        .icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-primary);
          transition: all 0.25s;
          cursor: pointer;
          text-decoration: none;
          position: relative;
        }
        .icon-btn:hover {
          background: var(--gold-dim);
          border-color: var(--gold);
          color: var(--gold-light);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(212,175,55,0.15);
        }

        /* ─── Cart badge ─── */
        .cart-badge {
          position: absolute;
          top: -6px; right: -6px;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D4AF37, #F5E27A);
          color: #0A0E1A;
          font-size: 10px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--navy);
          animation: pop 0.3s ease;
        }
        @keyframes pop {
          0%   { transform: scale(0); }
          80%  { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        /* ─── Mobile slide panel ─── */
        .mobile-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 200;
          transition: opacity 0.3s;
        }
        .mobile-panel {
          position: fixed;
          top: 0; right: 0;
          height: 100%;
          width: min(85vw, 360px);
          background: linear-gradient(180deg, #0A0E1A 0%, #0f1525 100%);
          border-left: 1px solid var(--border);
          z-index: 201;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .mobile-panel.closed { transform: translateX(100%); }
        .mobile-panel.open   { transform: translateX(0); }

        .mobile-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid var(--border);
        }

        .mobile-section { border-bottom: 1px solid rgba(212,175,55,0.08); }
        .mobile-section-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
        }
        .mobile-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 8px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-muted);
          transition: all 0.2s;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
        }
        .mobile-link:hover {
          color: var(--gold-light);
          background: var(--gold-dim);
          padding-left: 14px;
        }

        /* ─── Mobile search toggle ─── */
        @keyframes searchSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .search-slide { animation: searchSlide 0.25s ease; }

        /* ─── Divider glow ─── */
        .divider-glow {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
          margin: 0 20px;
        }

        /* Scrollbar for mobile panel */
        .mobile-panel::-webkit-scrollbar { width: 4px; }
        .mobile-panel::-webkit-scrollbar-track { background: transparent; }
        .mobile-panel::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
      `}</style>

      {/* ══ HEADER ══ */}
      <header
        className={`nav-header nav-font ${scrolled ? "scrolled" : "top"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[68px] gap-4">
            {/* ── Logo — now back on the left ── */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <img src={logoImage} alt="Logo" className="h-12 w-auto" />
              <div className="flex flex-col leading-tight items-start">
                <span className="text-xl font-bold logo-font shimmer-logo tracking-wide">
                  PAYIVVA
                </span>
                <span className="text-[11px] font-semibold tracking-[0.15em] text-[var(--text-muted)] uppercase">
                  Technologies
                </span>
                <span className="text-[8px] font-medium tracking-[0.18em] text-[#D4AF37] uppercase">
                  Inspiring Innovations
                </span>
              </div>
            </Link>

            {/* ── Filler / Search — fills middle space ── */}
            <div className="flex-1 flex min-w-0">
              <div className="hidden md:flex flex-1">
                <SearchBar />
              </div>
            </div>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-5 shrink-0">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <MegaMenu title="Products" items={productLinks} />
              <MegaMenu title="Services" items={serviceLinks} />
              <Link to="/solutions" className="nav-link">
                Solutions
              </Link>
              <Link to="/about" className="nav-link">
                About
              </Link>
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </nav>

            {/* ── Account (desktop) ── */}
            <div className="hidden lg:block shrink-0">
              <MegaMenu
                title={
                  <div className="flex flex-col items-start leading-tight -mt-1">
                    <span className="text-[10px] text-[var(--text-muted)] font-normal">
                      {isAuthenticated
                        ? `Hi, ${user?.first_name || "User"}`
                        : "Sign in"}
                    </span>
                    <span className="text-xs font-600 text-[var(--text-primary)]">
                      Account ▾
                    </span>
                  </div>
                }
                items={accountItems}
                align="right"
              />
            </div>

            {/* ── Cart ── */}
            <Link to="/cart" className="icon-btn shrink-0" title="Cart">
              <HiShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>

            {/* ── Mobile Hamburger ── */}
            <div className="flex lg:hidden items-center gap-2 shrink-0">
              <button
                className="icon-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <HiMenu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── Mobile Search (always visible on mobile) ── */}
          <div className="md:hidden pb-4 search-slide">
            <SearchBar />
          </div>
        </div>
      </header>

      {/* ══ MOBILE PANEL ══ */}
      {/* Overlay */}
      <div
        className="mobile-overlay lg:hidden"
        style={{
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
        onClick={() => setMobileOpen(false)}
      />

      {/* Panel */}
      <div
        className={`mobile-panel nav-font lg:hidden ${mobileOpen ? "open" : "closed"}`}
      >
        {/* Header */}
        <div className="mobile-panel-header">
          <div className="flex flex-col leading-tight">
            <span className="text-base font-black logo-font shimmer-logo tracking-widest">
              PAYIVVA
            </span>
            <span className="text-[8px] font-bold tracking-[0.2em] text-[rgba(240,237,216,0.5)] uppercase">
              Technologies
            </span>
          </div>
          <button
            className="icon-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* User greeting */}
        {isAuthenticated && (
          <div className="px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8921E] flex items-center justify-center text-[#0A0E1A] font-bold text-sm">
              {user?.first_name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Welcome back</p>
              <p className="text-sm font-600 text-[var(--text-primary)]">
                {user?.first_name || "User"}
              </p>
            </div>
          </div>
        )}

        {isAuthenticated && <div className="divider-glow" />}

        {/* Nav links */}
        <div className="px-5 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="divider-glow" />

        {/* Products */}
        <MobileSection
          title="Products"
          links={productLinks}
          onClose={() => setMobileOpen(false)}
        />

        {/* Services */}
        <MobileSection
          title="Services"
          links={serviceLinks}
          onClose={() => setMobileOpen(false)}
        />

        {/* Account */}
        <MobileSection
          title="Account"
          links={accountItems}
          onClose={() => setMobileOpen(false)}
        />

        {/* Footer note */}
        <div className="px-5 pb-6 pt-4 mt-auto border-t border-[var(--border)] text-center">
          <p className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
            Inspiring Innovations
          </p>
        </div>
      </div>
    </>
  );
}
