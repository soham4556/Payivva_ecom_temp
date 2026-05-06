import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/helpers";
import orderService from "../services/orderService";
import productService from "../services/productService";
import api from "../services/api";

/* ── Indian Rupee formatter ── */
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

/* ── Shared styles (mirrors VendorDashboard design system) ── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pv-ad {
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
  }
  .pv-ad .ad-serif { font-family: 'Playfair Display', serif; }

  @keyframes ad-fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ad-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes ad-spin { to { transform: rotate(360deg); } }
  @keyframes ad-modalIn {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .pv-ad .ad-anim   { animation: ad-fadeUp 0.45s ease both; }
  .pv-ad .ad-a1 { animation-delay: 0.04s; }
  .pv-ad .ad-a2 { animation-delay: 0.1s; }
  .pv-ad .ad-a3 { animation-delay: 0.16s; }
  .pv-ad .ad-a4 { animation-delay: 0.22s; }

  /* ── SIDEBAR ── */
  .pv-ad .ad-sidebar {
    width: 240px; flex-shrink: 0;
    background: var(--dark);
    min-height: calc(100vh - 5rem);
    display: flex; flex-direction: column;
    padding: 32px 0 24px;
    position: sticky; top: 0;
  }
  .pv-ad .sidebar-brand {
    padding: 0 24px 28px;
    border-bottom: 1px solid rgba(245,237,216,0.08);
    margin-bottom: 16px;
  }
  .pv-ad .sidebar-brand p {
    font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(245,237,216,0.3); margin: 0;
  }
  .pv-ad .sidebar-brand h2 {
    font-family: 'Playfair Display', serif;
    font-size: 18px; color: var(--gold); margin: 4px 0 0;
    font-style: italic;
  }
  .pv-ad .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 24px;
    font-size: 13px; font-weight: 500;
    color: rgba(245,237,216,0.45);
    text-decoration: none;
    border-left: 3px solid transparent;
    transition: all 0.2s;
    cursor: pointer; background: none; border-right: none; width: 100%; text-align: left;
  }
  .pv-ad .nav-item:hover {
    color: var(--cream);
    background: rgba(245,237,216,0.04);
    border-left-color: rgba(212,168,83,0.4);
  }
  .pv-ad .nav-item.active {
    color: var(--gold);
    background: rgba(212,168,83,0.08);
    border-left-color: var(--gold);
    font-weight: 600;
  }
  .pv-ad .nav-section {
    font-size: 9px; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(245,237,216,0.2);
    padding: 16px 24px 6px; margin-top: 8px;
  }

  /* ── CONTENT ── */
  .pv-ad .ad-main {
    flex: 1; padding: 36px 40px;
    background: var(--surface);
    min-height: calc(100vh - 5rem);
    overflow-x: hidden;
  }
  .pv-ad .page-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    color: var(--charcoal); margin: 0 0 4px; line-height: 1.1;
  }
  .pv-ad .gold-divider {
    width: 36px; height: 3px;
    background: var(--gold); border-radius: 2px; margin: 8px 0 28px;
  }

  /* ── STAT CARDS ── */
  .pv-ad .stat-card {
    background: #fff;
    border: 1px solid rgba(44,40,32,0.08);
    border-radius: 20px; padding: 24px;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    position: relative; overflow: hidden;
  }
  .pv-ad .stat-card:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    transform: translateY(-3px);
    border-color: rgba(212,168,83,0.25);
  }
  .pv-ad .stat-card::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .pv-ad .stat-card:hover::after { opacity: 1; }

  /* ── TABLE ── */
  .pv-ad .ad-table {
    background: #fff; border: 1px solid rgba(44,40,32,0.07);
    border-radius: 20px; overflow: hidden; width: 100%;
  }
  .pv-ad .ad-table table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .pv-ad .ad-table thead tr { background: rgba(245,237,216,0.5); }
  .pv-ad .ad-table th {
    padding: 13px 16px; text-align: left;
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--muted);
  }
  .pv-ad .ad-table td { padding: 13px 16px; color: var(--charcoal); }
  .pv-ad .ad-table tbody tr {
    border-top: 1px solid rgba(44,40,32,0.05);
    transition: background 0.15s;
  }
  .pv-ad .ad-table tbody tr:hover { background: rgba(245,237,216,0.3); }

  /* Status badge */
  .pv-ad .status-pill {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 100px;
    font-size: 11px; font-weight: 700; text-transform: capitalize;
    white-space: nowrap;
  }
  .pv-ad .s-approved  { background: rgba(46,204,113,0.12); color: #166534; }
  .pv-ad .s-active    { background: rgba(46,204,113,0.12); color: #166534; }
  .pv-ad .s-pending   { background: rgba(245,158,11,0.12); color: #B45309; }
  .pv-ad .s-inactive  { background: rgba(138,128,112,0.1); color: var(--muted); }
  .pv-ad .s-disabled  { background: rgba(192,57,43,0.1);  color: var(--danger); }
  .pv-ad .s-placed    { background: rgba(212,168,83,0.12); color: #8B6914; }
  .pv-ad .s-confirmed { background: rgba(79,158,255,0.12); color: #1A6FC4; }
  .pv-ad .s-packed    { background: rgba(138,128,112,0.12); color: #5A5040; }
  .pv-ad .s-shipped   { background: rgba(99,102,241,0.12); color: #4338CA; }
  .pv-ad .s-out_for_delivery { background: rgba(245,158,11,0.12); color: #B45309; }
  .pv-ad .s-delivered { background: rgba(46,204,113,0.12); color: #166534; }
  .pv-ad .s-cancelled { background: rgba(192,57,43,0.1); color: var(--danger); }

  /* ── INPUTS ── */
  .pv-ad .ad-label {
    display: block; font-size: 11px; font-weight: 700;
    letter-spacing: 0.09em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 8px;
  }
  .pv-ad .ad-input {
    width: 100%; padding: 12px 16px;
    border: 1.5px solid rgba(44,40,32,0.12);
    border-radius: 13px; font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--charcoal); background: #FDFBF7;
    outline: none; transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    box-sizing: border-box;
  }
  .pv-ad .ad-input::placeholder { color: #C4BAA8; }
  .pv-ad .ad-input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212,168,83,0.15);
    background: #fff;
  }
  .pv-ad .ad-input.error {
    border-color: var(--danger);
    box-shadow: 0 0 0 3px rgba(192,57,43,0.1);
  }
  .pv-ad textarea.ad-input { resize: vertical; min-height: 80px; line-height: 1.6; }

  /* ── BUTTONS ── */
  .pv-ad .btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 24px; background: var(--dark); color: var(--gold);
    border: none; border-radius: 14px;
    font-weight: 700; font-size: 14px; font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 4px 20px rgba(26,24,20,0.15);
  }
  .pv-ad .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(26,24,20,0.25);
  }
  .pv-ad .btn-primary:disabled { background: #C4BAA8; color: #fff; cursor: not-allowed; box-shadow: none; }

  .pv-ad .btn-gold {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 18px; background: var(--gold); color: var(--dark);
    border: none; border-radius: 12px;
    font-weight: 700; font-size: 13px; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.25s;
    box-shadow: 0 4px 16px rgba(212,168,83,0.25);
  }
  .pv-ad .btn-gold:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(212,168,83,0.35); }

  .pv-ad .btn-ghost {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 18px; background: #fff; color: var(--charcoal);
    border: 1.5px solid rgba(44,40,32,0.12); border-radius: 12px;
    font-weight: 600; font-size: 13px; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.25s;
  }
  .pv-ad .btn-ghost:hover { border-color: rgba(44,40,32,0.25); background: var(--cream); }

  /* Inline action link-buttons */
  .pv-ad .action-approve {
    font-size: 12px; font-weight: 700; color: #166534;
    background: rgba(46,204,113,0.08); border: 1px solid rgba(46,204,113,0.2);
    border-radius: 8px; padding: 4px 10px; cursor: pointer; transition: all 0.2s;
  }
  .pv-ad .action-approve:hover { background: rgba(46,204,113,0.15); }
  .pv-ad .action-disable {
    font-size: 12px; font-weight: 700; color: var(--danger);
    background: rgba(192,57,43,0.06); border: 1px solid rgba(192,57,43,0.15);
    border-radius: 8px; padding: 4px 10px; cursor: pointer; transition: all 0.2s;
  }
  .pv-ad .action-disable:hover { background: rgba(192,57,43,0.12); }
  .pv-ad .action-warn {
    font-size: 12px; font-weight: 700; color: #B45309;
    background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2);
    border-radius: 8px; padding: 4px 10px; cursor: pointer; transition: all 0.2s;
  }
  .pv-ad .action-warn:hover { background: rgba(245,158,11,0.15); }

  /* ── MODAL ── */
  .pv-ad .modal-backdrop {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(26,24,20,0.65);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .pv-ad .modal-box {
    background: var(--surface);
    border: 1px solid rgba(212,168,83,0.2);
    border-radius: 28px;
    width: 100%; max-width: 680px;
    max-height: 90vh;
    display: flex; flex-direction: column;
    overflow: hidden;
    animation: ad-modalIn 0.35s cubic-bezier(.22,1,.36,1) both;
    box-shadow: 0 32px 80px rgba(26,24,20,0.35);
  }
  .pv-ad .modal-header {
    padding: 28px 32px 20px;
    border-bottom: 1px solid rgba(44,40,32,0.08);
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
  }
  .pv-ad .modal-body {
    flex: 1; overflow-y: auto; padding: 28px 32px;
    display: flex; flex-direction: column; gap: 28px;
  }
  .pv-ad .modal-footer {
    padding: 20px 32px;
    border-top: 1px solid rgba(44,40,32,0.08);
    display: flex; align-items: center; justify-content: flex-end; gap: 12px;
    flex-shrink: 0; background: var(--surface);
  }
  .pv-ad .modal-section-title {
    font-size: 10px; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--gold); margin: 0 0 14px;
  }
  .pv-ad .modal-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
  }
  .pv-ad .modal-grid .full { grid-column: 1 / -1; }

  /* Close button */
  .pv-ad .btn-close {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(44,40,32,0.07); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); transition: all 0.2s;
  }
  .pv-ad .btn-close:hover { background: rgba(192,57,43,0.1); color: var(--danger); }

  /* Skeleton */
  .pv-ad .skeleton {
    background: linear-gradient(90deg, #f0ebe0 25%, #e8e0cf 50%, #f0ebe0 75%);
    background-size: 400px 100%;
    animation: ad-shimmer 1.4s ease-in-out infinite;
    border-radius: 10px;
  }

  /* Spinner */
  .pv-ad .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(212,168,83,0.3);
    border-top-color: var(--gold);
    border-radius: 50%; animation: ad-spin 0.7s linear infinite;
  }

  @media (max-width: 900px) {
    .pv-ad .ad-sidebar { display: none; }
    .pv-ad .ad-main { padding: 24px 16px; }
    .pv-ad .modal-grid { grid-template-columns: 1fr; }
    .pv-ad .modal-grid .full { grid-column: 1; }
  }
`;

/* ── Helpers ── */
const statusClass = (s) =>
  ({
    approved: "s-approved",
    active: "s-active",
    pending: "s-pending",
    inactive: "s-inactive",
    disabled: "s-disabled",
    placed: "s-placed",
    confirmed: "s-confirmed",
    packed: "s-packed",
    shipped: "s-shipped",
    out_for_delivery: "s-out_for_delivery",
    delivered: "s-delivered",
    cancelled: "s-cancelled",
  })[s] || "s-pending";

/* ── Nav Icons ── */
const NavIcons = {
  overview: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  vendors: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  products: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    </svg>
  ),
  orders: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  plus: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  close: () => (
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  arrow: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
};

/* ── Sidebar ── */
function Sidebar({ activeTab, onTabChange, onLogout }) {
  const items = [
    {
      key: "overview",
      label: "Overview",
      icon: NavIcons.overview,
      section: "Overview",
    },
    {
      key: "vendors",
      label: "Vendors",
      icon: NavIcons.vendors,
      section: "Management",
    },
    {
      key: "products",
      label: "Products",
      icon: NavIcons.products,
      section: null,
    },
    { key: "orders", label: "Orders", icon: NavIcons.orders, section: null },
  ];

  let lastSection = null;
  return (
    <aside className="ad-sidebar">
      <div className="sidebar-brand">
        <p>Admin Panel</p>
        <h2>Payivva</h2>
      </div>
      {items.map((item) => {
        const showSection = item.section && item.section !== lastSection;
        if (showSection) lastSection = item.section;
        return (
          <div key={item.key}>
            {showSection && <p className="nav-section">{item.section}</p>}
            <button
              className={`nav-item${activeTab === item.key ? " active" : ""}`}
              onClick={() => onTabChange(item.key)}
            >
              <item.icon /> {item.label}
            </button>
          </div>
        );
      })}
      <div style={{ marginTop: "auto", padding: "0 16px" }}>
        <button
          className="nav-item"
          style={{ width: "100%", color: "rgba(192,57,43,0.6)", marginTop: 8 }}
          onClick={onLogout}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#E74C3C")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(192,57,43,0.6)")
          }
        >
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
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

/* ── Page Header ── */
function PageHeader({ title, subtitle, children }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 32,
      }}
    >
      <div className="ad-anim ad-a1">
        <h2 className="page-title">{title}</h2>
        {subtitle && (
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0 0" }}>
            {subtitle}
          </p>
        )}
        <div className="gold-divider" />
      </div>
      {children && (
        <div
          className="ad-anim ad-a2"
          style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Skeleton ── */
function Skeleton({ rows = 3 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            background: "#fff",
            border: "1px solid rgba(44,40,32,0.07)",
            borderRadius: 16,
            padding: "20px 24px",
          }}
        >
          <div
            className="skeleton"
            style={{ height: 13, width: "35%", marginBottom: 10 }}
          />
          <div className="skeleton" style={{ height: 11, width: "55%" }} />
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════
   OVERVIEW TAB
══════════════════════════════ */
function OverviewTab({ stats, loading }) {
  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="stat-card skeleton" style={{ height: 110 }} />
        ))}
      </div>
    );
  }
  if (!stats) return null;

  const statItems = [
    {
      label: "Total Revenue",
      value: formatINR(stats.total_revenue || 0),
      icon: "₹",
      color: "#D4A853",
      bg: "rgba(212,168,83,0.1)",
    },
    {
      label: "Total Orders",
      value: stats.total_orders || 0,
      icon: "📦",
      color: "#4F9EFF",
      bg: "rgba(79,158,255,0.1)",
    },
    {
      label: "Total Products",
      value: stats.total_products || 0,
      icon: "🏷️",
      color: "#62D9A4",
      bg: "rgba(98,217,164,0.1)",
    },
    {
      label: "Total Customers",
      value: stats.total_customers || 0,
      icon: "👤",
      color: "#A78BFA",
      bg: "rgba(167,139,250,0.1)",
    },
    {
      label: "Active Vendors",
      value: stats.total_vendors || 0,
      icon: "🏪",
      color: "#34D399",
      bg: "rgba(52,211,153,0.1)",
    },
    {
      label: "Pending Vendors",
      value: stats.pending_vendors || 0,
      icon: "⏳",
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.1)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
      }}
    >
      {statItems.map((item, i) => (
        <div
          key={item.label}
          className="stat-card ad-anim"
          style={{
            animationDelay: `${0.05 + i * 0.07}s`,
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  margin: "0 0 10px",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "var(--charcoal)",
                  margin: 0,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {item.value}
              </p>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: item.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              {item.icon === "₹" ? (
                <span
                  style={{ fontWeight: 800, color: item.color, fontSize: 18 }}
                >
                  ₹
                </span>
              ) : (
                item.icon
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════
   VENDORS TAB
══════════════════════════════ */
function VendorsTab({ vendors, onStatusChange, onAddClick }) {
  return (
    <div>
      <PageHeader
        title={
          <>
            Vendor <em>Management</em>
          </>
        }
        subtitle={`${vendors.length} vendors registered`}
      >
        <button className="btn-primary" onClick={onAddClick}>
          <NavIcons.plus /> Add Vendor
        </button>
      </PageHeader>
      {vendors.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px" }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🏪</div>
          <h3
            className="ad-serif"
            style={{ fontSize: 20, color: "var(--charcoal)" }}
          >
            No vendors <em>yet</em>
          </h3>
        </div>
      ) : (
        <div className="ad-table ad-anim ad-a2" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                {["Company", "Email", "Phone", "Status", "Actions"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600 }}>{v.company_name}</td>
                  <td style={{ color: "var(--muted)" }}>{v.user?.email}</td>
                  <td style={{ color: "var(--muted)" }}>{v.phone || "—"}</td>
                  <td>
                    <span className={`status-pill ${statusClass(v.status)}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {v.status === "pending" && (
                        <button
                          className="action-approve"
                          onClick={() => onStatusChange(v.id, "approved")}
                        >
                          Approve
                        </button>
                      )}
                      {v.status === "disabled" && (
                        <button
                          className="action-approve"
                          onClick={() => onStatusChange(v.id, "approved")}
                        >
                          Enable
                        </button>
                      )}
                      {v.status !== "disabled" && (
                        <button
                          className="action-disable"
                          onClick={() => onStatusChange(v.id, "disabled")}
                        >
                          Disable
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════
   PRODUCTS TAB
══════════════════════════════ */
function ProductsTab({ products, onStatusChange, onDelete }) {
  return (
    <div>
      <PageHeader
        title={
          <>
            Product <em>Catalogue</em>
          </>
        }
        subtitle={`${products.length} products listed`}
      />
      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px" }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>📦</div>
          <h3
            className="ad-serif"
            style={{ fontSize: 20, color: "var(--charcoal)" }}
          >
            No products <em>yet</em>
          </h3>
        </div>
      ) : (
        <div className="ad-table ad-anim ad-a2" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                {["Product", "Vendor", "Price", "Status", "Actions"].map(
                  (h) => (
                    <th key={h}>{h}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--muted)" }}>{p.vendor_name}</td>
                  <td style={{ fontWeight: 700 }}>{formatINR(p.price)}</td>
                  <td>
                    <span className={`status-pill ${statusClass(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {p.status === "pending" && (
                        <button
                          className="action-approve"
                          onClick={() => onStatusChange(p.id, "active")}
                        >
                          Activate
                        </button>
                      )}
                      {p.status === "active" && (
                        <button
                          className="action-warn"
                          onClick={() => onStatusChange(p.id, "inactive")}
                        >
                          Deactivate
                        </button>
                      )}
                      <button
                        className="action-disable"
                        onClick={() => onDelete(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════
   ORDERS TAB
══════════════════════════════ */
function OrdersTab({ orders }) {
  return (
    <div>
      <PageHeader
        title={
          <>
            All <em>Orders</em>
          </>
        }
        subtitle={`${orders.length} orders total`}
      />
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px" }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>📋</div>
          <h3
            className="ad-serif"
            style={{ fontSize: 20, color: "var(--charcoal)" }}
          >
            No orders <em>yet</em>
          </h3>
        </div>
      ) : (
        <div className="ad-table ad-anim ad-a2" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                {["Order", "Customer", "Vendor", "Total", "Status", "Date"].map(
                  (h) => (
                    <th key={h}>{h}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700 }}>#{order.id}</td>
                  <td style={{ color: "var(--muted)" }}>
                    {order.customer_email}
                  </td>
                  <td style={{ color: "var(--muted)" }}>{order.vendor_name}</td>
                  <td style={{ fontWeight: 700 }}>
                    {formatINR(order.total_price)}
                  </td>
                  <td>
                    <span
                      className={`status-pill ${statusClass(order.status)}`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>
                    {formatDate(order.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════
   ADD VENDOR MODAL
══════════════════════════════ */
function AddVendorModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
    company_name: "",
    phone: "",
    address: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const userRes = await api.post("/auth/register/", {
        email: form.email,
        username: form.username,
        first_name: form.first_name,
        last_name: form.last_name,
        password: form.password,
        password2: form.password2,
        role: "vendor",
      });
      try {
        await api.post("/vendors/admin/", {
          user: userRes.data.user.id,
          company_name: form.company_name,
          phone: form.phone,
          address: form.address,
          description: form.description,
        });
      } catch {
        await api.post("/vendors/register/", {
          user: userRes.data.user.id,
          company_name: form.company_name,
          phone: form.phone,
          address: form.address,
          description: form.description,
        });
      }
      onSuccess();
    } catch (err) {
      const data = err.response?.data;
      setError(
        data
          ? typeof data === "string"
            ? data
            : JSON.stringify(data)
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordMismatch =
    form.password && form.password2 && form.password !== form.password2;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2
              className="page-title"
              style={{ fontSize: "1.3rem", marginBottom: 2 }}
            >
              Add <em>Vendor</em>
            </h2>
            <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
              Create a new vendor account on Payivva
            </p>
          </div>
          <button className="btn-close" onClick={onClose}>
            <NavIcons.close />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  padding: "12px 14px",
                  background: "rgba(192,57,43,0.06)",
                  border: "1px solid rgba(192,57,43,0.18)",
                  borderRadius: 12,
                  fontSize: 13,
                  color: "var(--danger)",
                }}
              >
                {error}
              </div>
            )}

            {/* Account info */}
            <div>
              <p className="modal-section-title">Account Information</p>
              <div className="modal-grid">
                <div>
                  <label className="ad-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="ad-input"
                    placeholder="vendor@example.com"
                    value={form.email}
                    onChange={set("email")}
                  />
                </div>
                <div>
                  <label className="ad-label">Username</label>
                  <input
                    type="text"
                    required
                    className="ad-input"
                    placeholder="johndoe_v"
                    value={form.username}
                    onChange={set("username")}
                  />
                </div>
                <div>
                  <label className="ad-label">First Name</label>
                  <input
                    type="text"
                    required
                    className="ad-input"
                    placeholder="John"
                    value={form.first_name}
                    onChange={set("first_name")}
                  />
                </div>
                <div>
                  <label className="ad-label">Last Name</label>
                  <input
                    type="text"
                    required
                    className="ad-input"
                    placeholder="Doe"
                    value={form.last_name}
                    onChange={set("last_name")}
                  />
                </div>
                <div>
                  <label className="ad-label">Password</label>
                  <input
                    type="password"
                    required
                    className="ad-input"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set("password")}
                  />
                </div>
                <div>
                  <label className="ad-label">Confirm Password</label>
                  <input
                    type="password"
                    required
                    className={`ad-input${passwordMismatch ? " error" : ""}`}
                    placeholder="••••••••"
                    value={form.password2}
                    onChange={set("password2")}
                  />
                  {passwordMismatch && (
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--danger)",
                        margin: "4px 0 0",
                      }}
                    >
                      Passwords don't match
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Vendor profile */}
            <div>
              <p className="modal-section-title">Business Profile</p>
              <div className="modal-grid">
                <div className="full">
                  <label className="ad-label">Company Name</label>
                  <input
                    type="text"
                    required
                    className="ad-input"
                    placeholder="ACME Corporation"
                    value={form.company_name}
                    onChange={set("company_name")}
                  />
                </div>
                <div>
                  <label className="ad-label">Phone Number</label>
                  <input
                    type="tel"
                    className="ad-input"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </div>
                <div>
                  <label className="ad-label">Address</label>
                  <input
                    type="text"
                    className="ad-input"
                    placeholder="Mumbai, India"
                    value={form.address}
                    onChange={set("address")}
                  />
                </div>
                <div className="full">
                  <label className="ad-label">Business Description</label>
                  <textarea
                    className="ad-input"
                    placeholder="Briefly describe the business..."
                    rows={3}
                    value={form.description}
                    onChange={set("description")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner" /> Processing...
                </>
              ) : (
                <>
                  Create Vendor <NavIcons.arrow />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   MAIN LAYOUT
══════════════════════════════ */
export default function AdminDashboard() {
  const { isAdmin, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddVendor, setShowAddVendor] = useState(false);

  // Sync tab with URL
  useEffect(() => {
    const seg = location.pathname.split("/").filter(Boolean);
    const last = seg[seg.length - 1];
    const keys = ["overview", "vendors", "products", "orders"];
    if (keys.includes(last)) setActiveTab(last);
    else setActiveTab("overview");
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
      return;
    }
    setLoading(true);
    orderService
      .getAdminStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    if (activeTab === "vendors") {
      api
        .get("/vendors/admin/list/")
        .then(({ data }) => setVendors(data.results || data))
        .catch(() => {});
    } else if (activeTab === "products") {
      productService
        .getAdminProducts()
        .then((data) => setProducts(data.results || data))
        .catch(() => {});
    } else if (activeTab === "orders") {
      orderService
        .getAdminOrders()
        .then((data) => setOrders(data.results || data))
        .catch(() => {});
    }
  }, [activeTab]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/admin/${key}`);
  };

  const handleVendorStatus = async (vendorId, status) => {
    try {
      await api.patch(`/vendors/admin/${vendorId}/`, { status });
      setVendors((prev) =>
        prev.map((v) => (v.id === vendorId ? { ...v, status } : v)),
      );
    } catch {
      alert("Failed to update vendor status.");
    }
  };

  const handleProductStatus = async (productId, status) => {
    try {
      await productService.adminUpdateProduct(productId, { status });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status } : p)),
      );
    } catch {
      alert("Failed to update product status.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await productService.adminDeleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch {
      alert("Failed to delete product.");
    }
  };

  const handleVendorAdded = async () => {
    setShowAddVendor(false);
    if (activeTab === "vendors") {
      const { data } = await api.get("/vendors/admin/list/");
      setVendors(data.results || data);
    }
  };

  const tabTitles = {
    overview: (
      <>
        <em>Dashboard</em> Overview
      </>
    ),
    vendors: null, // managed by VendorsTab
    products: null, // managed by ProductsTab
    orders: null, // managed by OrdersTab
  };

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <>
      <style>{styles}</style>
      <Helmet>
        <title>Admin Dashboard — Payivva</title>
      </Helmet>

      <div
        className="pv-ad"
        style={{ display: "flex", minHeight: "calc(100vh - 5rem)" }}
      >
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={() => {
            logout();
            navigate("/login");
          }}
        />

        <main className="ad-main">
          {/* Overview has its own header inline */}
          {activeTab === "overview" && (
            <>
              <PageHeader
                title={
                  <>
                    Dashboard <em>Overview</em>
                  </>
                }
                subtitle="Platform-wide performance at a glance"
              />
              <OverviewTab stats={stats} loading={loading} />
            </>
          )}

          {activeTab === "vendors" &&
            (loading ? (
              <Skeleton />
            ) : (
              <VendorsTab
                vendors={vendors}
                onStatusChange={handleVendorStatus}
                onAddClick={() => setShowAddVendor(true)}
              />
            ))}

          {activeTab === "products" &&
            (loading ? (
              <Skeleton />
            ) : (
              <ProductsTab
                products={products}
                onStatusChange={handleProductStatus}
                onDelete={handleDeleteProduct}
              />
            ))}

          {activeTab === "orders" &&
            (loading ? <Skeleton /> : <OrdersTab orders={orders} />)}
        </main>
      </div>

      {showAddVendor && (
        <AddVendorModal
          onClose={() => setShowAddVendor(false)}
          onSuccess={handleVendorAdded}
        />
      )}
    </>
  );
}
