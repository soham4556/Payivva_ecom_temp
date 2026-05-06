import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Link,
  useParams,
  useLocation,
} from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HiDownload, HiTrash } from "react-icons/hi";
import DashboardStats from "../components/DashboardStats";
import { useAuth } from "../context/AuthContext";
import { formatDate, getStatusColor } from "../utils/helpers";
import { ORDER_STATUSES } from "../utils/constants";
import productService from "../services/productService";
import orderService from "../services/orderService";
import api from "../services/api";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

/* ── Indian Rupee formatter ── */
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

/* ── Shared styles ── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pv-vd {
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
  .pv-vd .vd-serif { font-family: 'Playfair Display', serif; }

  @keyframes vd-fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes vd-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes vd-spin { to { transform: rotate(360deg); } }

  .pv-vd .vd-anim   { animation: vd-fadeUp 0.45s ease both; }
  .pv-vd .vd-a1 { animation-delay: 0.04s; }
  .pv-vd .vd-a2 { animation-delay: 0.1s; }
  .pv-vd .vd-a3 { animation-delay: 0.16s; }
  .pv-vd .vd-a4 { animation-delay: 0.22s; }

  /* ── SIDEBAR ── */
  .pv-vd .vd-sidebar {
    width: 240px; flex-shrink: 0;
    background: var(--dark);
    min-height: calc(100vh - 5rem);
    display: flex; flex-direction: column;
    padding: 32px 0 24px;
    position: sticky; top: 0;
  }
  .pv-vd .sidebar-brand {
    padding: 0 24px 28px;
    border-bottom: 1px solid rgba(245,237,216,0.08);
    margin-bottom: 16px;
  }
  .pv-vd .sidebar-brand p {
    font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(245,237,216,0.3); margin: 0;
  }
  .pv-vd .sidebar-brand h2 {
    font-family: 'Playfair Display', serif;
    font-size: 18px; color: var(--gold); margin: 4px 0 0;
    font-style: italic;
  }

  .pv-vd .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 24px;
    font-size: 13px; font-weight: 500;
    color: rgba(245,237,216,0.45);
    text-decoration: none;
    border-left: 3px solid transparent;
    transition: all 0.2s;
    cursor: pointer; background: none; border-right: none; width: 100%; text-align: left;
  }
  .pv-vd .nav-item:hover {
    color: var(--cream);
    background: rgba(245,237,216,0.04);
    border-left-color: rgba(212,168,83,0.4);
  }
  .pv-vd .nav-item.active {
    color: var(--gold);
    background: rgba(212,168,83,0.08);
    border-left-color: var(--gold);
    font-weight: 600;
  }
  .pv-vd .nav-section {
    font-size: 9px; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(245,237,216,0.2);
    padding: 16px 24px 6px; margin-top: 8px;
  }

  /* ── CONTENT ── */
  .pv-vd .vd-main {
    flex: 1; padding: 36px 40px;
    background: var(--surface);
    min-height: calc(100vh - 5rem);
    overflow-x: hidden;
  }

  .pv-vd .page-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    color: var(--charcoal); margin: 0 0 4px; line-height: 1.1;
  }
  .pv-vd .gold-divider {
    width: 36px; height: 3px;
    background: var(--gold); border-radius: 2px; margin: 8px 0 28px;
  }

  /* ── STAT CARDS ── */
  .pv-vd .stat-card {
    background: #fff;
    border: 1px solid rgba(44,40,32,0.08);
    border-radius: 20px; padding: 24px;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    position: relative; overflow: hidden;
  }
  .pv-vd .stat-card:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    transform: translateY(-3px);
    border-color: rgba(212,168,83,0.25);
  }
  .pv-vd .stat-card::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .pv-vd .stat-card:hover::after { opacity: 1; }

  /* ── TABLE ── */
  .pv-vd .vd-table {
    background: #fff; border: 1px solid rgba(44,40,32,0.07);
    border-radius: 20px; overflow: hidden; width: 100%;
  }
  .pv-vd .vd-table table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .pv-vd .vd-table thead tr { background: rgba(245,237,216,0.5); }
  .pv-vd .vd-table th {
    padding: 13px 16px; text-align: left;
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--muted);
  }
  .pv-vd .vd-table td { padding: 13px 16px; color: var(--charcoal); }
  .pv-vd .vd-table tbody tr {
    border-top: 1px solid rgba(44,40,32,0.05);
    transition: background 0.15s;
  }
  .pv-vd .vd-table tbody tr:hover { background: rgba(245,237,216,0.3); }

  /* Status badge */
  .pv-vd .status-pill {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 100px;
    font-size: 11px; font-weight: 700; text-transform: capitalize;
    white-space: nowrap;
  }
  .pv-vd .s-placed    { background: rgba(212,168,83,0.12); color: #8B6914; }
  .pv-vd .s-confirmed { background: rgba(79,158,255,0.12); color: #1A6FC4; }
  .pv-vd .s-packed    { background: rgba(138,128,112,0.12); color: #5A5040; }
  .pv-vd .s-shipped   { background: rgba(99,102,241,0.12); color: #4338CA; }
  .pv-vd .s-out_for_delivery { background: rgba(245,158,11,0.12); color: #B45309; }
  .pv-vd .s-delivered { background: rgba(46,204,113,0.12); color: #166534; }
  .pv-vd .s-cancelled { background: rgba(192,57,43,0.1); color: var(--danger); }
  .pv-vd .s-active    { background: rgba(46,204,113,0.12); color: #166534; }
  .pv-vd .s-inactive  { background: rgba(138,128,112,0.1); color: var(--muted); }
  .pv-vd .s-pending   { background: rgba(245,158,11,0.12); color: #B45309; }

  /* ── INPUTS ── */
  .pv-vd .vd-label {
    display: block; font-size: 11px; font-weight: 700;
    letter-spacing: 0.09em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 8px;
  }
  .pv-vd .vd-input {
    width: 100%; padding: 12px 16px;
    border: 1.5px solid rgba(44,40,32,0.12);
    border-radius: 13px; font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--charcoal); background: #FDFBF7;
    outline: none; transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    box-sizing: border-box;
  }
  .pv-vd .vd-input::placeholder { color: #C4BAA8; }
  .pv-vd .vd-input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212,168,83,0.15);
    background: #fff;
  }
  .pv-vd textarea.vd-input { resize: vertical; min-height: 96px; line-height: 1.6; }

  .pv-vd .vd-select {
    appearance: none; -webkit-appearance: none;
    width: 100%; padding: 12px 40px 12px 16px;
    border: 1.5px solid rgba(44,40,32,0.12);
    border-radius: 13px; font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--charcoal);
    background: #FDFBF7 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A8070' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 14px center;
    outline: none; cursor: pointer;
    transition: border-color 0.25s, box-shadow 0.25s;
    box-sizing: border-box;
  }
  .pv-vd .vd-select:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212,168,83,0.15);
    background-color: #fff;
  }

  /* Inline select for table */
  .pv-vd .vd-select-inline {
    appearance: none; -webkit-appearance: none;
    padding: 4px 28px 4px 10px;
    border-radius: 100px; font-size: 11px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    border: none; outline: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238A8070' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
  }

  /* Checkbox */
  .pv-vd .vd-checkbox-row {
    display: flex; align-items: center; gap: 10px; cursor: pointer;
    padding: 12px 16px;
    border: 1.5px solid rgba(44,40,32,0.1);
    border-radius: 13px; background: #FDFBF7;
    transition: border-color 0.2s, background 0.2s;
    flex: 1;
  }
  .pv-vd .vd-checkbox-row:has(input:checked) {
    border-color: var(--gold);
    background: rgba(212,168,83,0.05);
  }

  /* ── BUTTONS ── */
  .pv-vd .btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 24px; background: var(--dark); color: var(--gold);
    border: none; border-radius: 14px;
    font-weight: 700; font-size: 14px; font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 4px 20px rgba(26,24,20,0.15);
  }
  .pv-vd .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(26,24,20,0.25);
  }
  .pv-vd .btn-primary:disabled { background: #C4BAA8; color: #fff; cursor: not-allowed; box-shadow: none; }

  .pv-vd .btn-gold {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 18px; background: var(--gold); color: var(--dark);
    border: none; border-radius: 12px;
    font-weight: 700; font-size: 13px; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.25s;
    box-shadow: 0 4px 16px rgba(212,168,83,0.25);
  }
  .pv-vd .btn-gold:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(212,168,83,0.35); }

  .pv-vd .btn-ghost {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 18px; background: #fff; color: var(--charcoal);
    border: 1.5px solid rgba(44,40,32,0.12); border-radius: 12px;
    font-weight: 600; font-size: 13px; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.25s;
  }
  .pv-vd .btn-ghost:hover { border-color: rgba(44,40,32,0.25); background: var(--cream); }

  /* Error box */
  .pv-vd .error-box {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 12px 14px;
    background: rgba(192,57,43,0.06);
    border: 1px solid rgba(192,57,43,0.18);
    border-radius: 12px; margin-bottom: 20px;
    font-size: 13px; color: var(--danger); line-height: 1.5;
  }

  /* Skeleton */
  .pv-vd .skeleton {
    background: linear-gradient(90deg, #f0ebe0 25%, #e8e0cf 50%, #f0ebe0 75%);
    background-size: 400px 100%;
    animation: vd-shimmer 1.4s ease-in-out infinite;
    border-radius: 10px;
  }

  /* Spinner */
  .pv-vd .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(212,168,83,0.3);
    border-top-color: var(--gold);
    border-radius: 50%; animation: vd-spin 0.7s linear infinite;
  }

  /* Order card */
  .pv-vd .order-card {
    background: #fff; border: 1px solid rgba(44,40,32,0.08);
    border-radius: 20px; padding: 24px;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
  }
  .pv-vd .order-card:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.07);
    border-color: rgba(212,168,83,0.2);
    transform: translateY(-2px);
  }

  /* Form card */
  .pv-vd .form-card {
    background: #fff; border: 1px solid rgba(44,40,32,0.08);
    border-radius: 24px; padding: 36px;
  }

  /* Image upload zone */
  .pv-vd .upload-zone {
    border: 2px dashed rgba(44,40,32,0.15);
    border-radius: 16px; padding: 28px;
    text-align: center; cursor: pointer;
    transition: all 0.25s; background: #FDFBF7;
  }
  .pv-vd .upload-zone:hover {
    border-color: var(--gold);
    background: rgba(212,168,83,0.04);
  }

  /* Rupee symbol styling */
  .pv-vd .rupee { font-size: 13px; opacity: 0.8; }

  @media (max-width: 900px) {
    .pv-vd .vd-sidebar { display: none; }
    .pv-vd .vd-main { padding: 24px 16px; }
  }
`;

/* ── Icon components ── */
const NavIcons = {
  dashboard: () => (
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
  profile: () => (
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
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  add: () => (
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
};

const AlertIcon = () => (
  <svg
    width="15"
    height="15"
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
const ArrowRight = () => (
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
);

const statusClass = (s) =>
  ({
    placed: "s-placed",
    confirmed: "s-confirmed",
    packed: "s-packed",
    shipped: "s-shipped",
    out_for_delivery: "s-out_for_delivery",
    delivered: "s-delivered",
    cancelled: "s-cancelled",
    active: "s-active",
    inactive: "s-inactive",
    pending: "s-pending",
  })[s] || "s-placed";

/* ── SIDEBAR ── */
function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const path = location.pathname;

  const navLink = (to, icon, label) => (
    <Link
      to={to}
      className={`nav-item${path === to || path.startsWith(to + "/") ? " active" : ""}`}
    >
      {icon()} {label}
    </Link>
  );

  return (
    <aside className="vd-sidebar">
      <div className="sidebar-brand">
        <p>Vendor Panel</p>
        <h2>Payivva</h2>
      </div>

      <p className="nav-section">Overview</p>
      {navLink("/vendor/dashboard", NavIcons.dashboard, "Dashboard")}
      {navLink("/vendor/dashboard/profile", NavIcons.profile, "My Profile")}

      <p className="nav-section">Catalogue</p>
      {navLink("/vendor/dashboard/products", NavIcons.products, "My Products")}
      {navLink("/vendor/dashboard/products/new", NavIcons.add, "Add Product")}

      <p className="nav-section">Sales</p>
      {navLink("/vendor/dashboard/orders", NavIcons.orders, "Orders")}

      <div style={{ marginTop: "auto", padding: "0 16px" }}>
        <button
          className="nav-item"
          style={{ width: "100%", color: "rgba(192,57,43,0.6)", marginTop: 8 }}
          onClick={() => {
            logout();
            navigate("/login");
          }}
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

/* ── PAGE HEADER ── */
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
      <div className="vd-anim vd-a1">
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
          className="vd-anim vd-a2"
          style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* ── SKELETON ── */
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
   VENDOR HOME
══════════════════════════════ */
function VendorHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getVendorStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div>
        <PageHeader
          title={<>Dashboard <em>Overview</em></>}
          subtitle="Loading your shop analytics..."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card skeleton" style={{ height: 110 }} />
          ))}
        </div>
      </div>
    );

  const statusMap = (stats?.status_counts || []).reduce((acc, s) => {
    acc[s.status] = s.count;
    return acc;
  }, {});

  const totalOrders = (stats?.status_counts || []).reduce((sum, s) => sum + s.count, 0);
  const pendingOrders = totalOrders - (statusMap.delivered || 0) - (statusMap.cancelled || 0);

  const statItems = [
    { label: "Total Revenue", value: formatINR(stats?.total_revenue || 0), icon: "₹", color: "#D4A853", bg: "rgba(212,168,83,0.1)" },
    { label: "Products Sold", value: stats?.total_sold || 0, icon: "🏷️", color: "#62D9A4", bg: "rgba(98,217,164,0.1)" },
    { label: "Active Orders", value: pendingOrders, icon: "📦", color: "#4F9EFF", bg: "rgba(79,158,255,0.1)" },
    { label: "Cancelled", value: statusMap.cancelled || 0, icon: "❌", color: "#F87171", bg: "rgba(248,113,113,0.1)" },
  ];

  const COLORS = ['#D4A853', '#4F9EFF', '#62D9A4', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <div className="vd-anim">
      <PageHeader
        title={<>Dashboard <em>Overview</em></>}
        subtitle="Detailed analysis of your shop performance"
      />

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
        {statItems.map((item, i) => (
          <div key={item.label} className="stat-card vd-anim" style={{ 
            animationDelay: `${0.05 + i * 0.07}s`, opacity: 0, animationFillMode: "forwards",
            background: "#fff", border: "1px solid rgba(44,40,32,0.08)", borderRadius: 20, padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" 
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 8px" }}>{item.label}</p>
                <p style={{ fontSize: 26, fontWeight: 900, color: "var(--charcoal)", margin: 0, fontFamily: "'Playfair Display', serif" }}>{item.value}</p>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: item.bg, color: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24, marginBottom: 32 }}>
        {/* Sales Trend Chart */}
        <div style={{ background: "#fff", borderRadius: 24, padding: 24, border: "1px solid rgba(44,40,32,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <h4 className="vd-serif" style={{ fontSize: 18, marginBottom: 20 }}>Sales <em>Trend</em></h4>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthly_sales || []}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--gold)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--muted)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--muted)'}} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }} formatter={(v) => [formatINR(v), 'Revenue']} />
                <Area type="monotone" dataKey="sales" stroke="var(--gold)" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div style={{ background: "#fff", borderRadius: 24, padding: 24, border: "1px solid rgba(44,40,32,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <h4 className="vd-serif" style={{ fontSize: 18, marginBottom: 20 }}>Category <em>Analysis</em></h4>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats?.category_distribution || []} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {(stats?.category_distribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }} formatter={(v) => formatINR(v)} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24 }}>
         {/* Order Status Distribution */}
         <div style={{ background: "#fff", borderRadius: 24, padding: 24, border: "1px solid rgba(44,40,32,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <h4 className="vd-serif" style={{ fontSize: 18, marginBottom: 20 }}>Order <em>Status</em></h4>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(stats?.status_counts || []).map(s => ({ name: s.status.replace(/_/g, ' '), count: s.count }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'var(--muted)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--muted)'}} />
                <Tooltip cursor={{fill: 'rgba(212,168,83,0.05)'}} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }} />
                <Bar dataKey="count" fill="var(--gold)" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Insights */}
        <div style={{ background: "linear-gradient(135deg, var(--dark) 0%, #2C2820 100%)", borderRadius: 24, padding: 32, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h3 className="vd-serif" style={{ color: "var(--gold)", fontSize: 24, marginBottom: 12 }}>Sales <em>Insights</em></h3>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            Your shop's performance is increasing! Track your revenue trends and optimize your product listings to reach more customers.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/vendor/dashboard/products/new" style={{ textDecoration: 'none', background: 'var(--gold)', color: 'var(--dark)', padding: '12px 20px', borderRadius: 12, fontWeight: 700, fontSize: 14 }}>Add Product</Link>
            <Link to="/vendor/dashboard/orders" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '12px 20px', borderRadius: 12, fontWeight: 700, fontSize: 14, border: '1px solid rgba(255,255,255,0.2)' }}>View Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   VENDOR PRODUCTS
══════════════════════════════ */
function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    productService
      .getVendorProducts()
      .then((data) => setProducts(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(fetchProducts, []);

  const handleStatusChange = async (product, newStatus) => {
    try {
      await api.patch(`/products/vendor/${product.id}/`, { status: newStatus });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, status: newStatus } : p,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.detail || "Unable to update product status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await productService.deleteProduct(id);
    fetchProducts();
  };

  return (
    <div>
      <PageHeader
        title={
          <>
            My <em>Products</em>
          </>
        }
        subtitle={`${products.length} products listed`}
      >
        <Link
          to="/vendor/dashboard/products/new"
          className="btn-primary"
          style={{ textDecoration: "none" }}
        >
          <NavIcons.add /> Add Product
        </Link>
      </PageHeader>

      {loading ? (
        <Skeleton />
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px" }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>📦</div>
          <h3
            className="vd-serif"
            style={{ fontSize: 20, color: "var(--charcoal)", marginBottom: 8 }}
          >
            No products <em>yet</em>
          </h3>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>
            Add your first product to start selling.
          </p>
          <Link
            to="/vendor/dashboard/products/new"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            Add Product
          </Link>
        </div>
      ) : (
        <div className="vd-table vd-anim vd-a2" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                {["Product", "Price (₹)", "Stock", "Status", "Actions"].map(
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
                            background: "#eee",
                          }}
                        />
                      )}
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatINR(p.price)}</td>
                  <td>
                    <span
                      style={{
                        fontWeight: 600,
                        color:
                          p.stock < 5 ? "var(--danger)" : "var(--charcoal)",
                      }}
                    >
                      {p.stock}{" "}
                      {p.stock < 5 && (
                        <span style={{ fontSize: 10, color: "var(--danger)" }}>
                          low
                        </span>
                      )}
                    </span>
                  </td>
                  <td>
                    <select
                      value={p.status}
                      onChange={(e) => handleStatusChange(p, e.target.value)}
                      className={`vd-select-inline status-pill ${statusClass(p.status)}`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link
                        to={`/vendor/dashboard/products/edit/${p.id}`}
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--gold)",
                          textDecoration: "none",
                          padding: "4px 10px",
                          border: "1px solid rgba(212,168,83,0.3)",
                          borderRadius: 8,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(212,168,83,0.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--danger)",
                          background: "none",
                          border: "1px solid rgba(192,57,43,0.2)",
                          borderRadius: 8,
                          padding: "4px 10px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(192,57,43,0.08)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "none")
                        }
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
   ADD / EDIT PRODUCT FORM
══════════════════════════════ */
function VendorProductForm() {
  const { productId } = useParams();
  const isEditing = !!productId;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    status: "active",
    is_returnable: false,
    is_exchangeable: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    console.log("VendorDashboard: Initiating category fetch...");
    productService
      .getCategories()
      .then((data) => {
        console.log("VendorDashboard: Categories data received:", data);
        const cats = Array.isArray(data) ? data : (data.results || data.data || []);
        setCategories(cats);
        if (cats.length === 0) {
          console.warn("VendorDashboard: Fetched categories list is empty.");
        }
      })
      .catch((err) => {
        console.error("VendorDashboard: Failed to fetch categories:", err);
        setError(`Failed to load categories: ${err.message || "Connection Error"}`);
      });
  }, []);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      api
        .get(`/products/vendor/${productId}/`)
        .then(({ data }) => {
          setForm({
            name: data.name,
            category: data.category,
            description: data.description,
            price: data.price,
            stock: data.stock,
            image: null,
            status: data.status,
            is_returnable: data.is_returnable,
            is_exchangeable: data.is_exchangeable,
          });
          setImagePreview(data.image);
        })
        .catch(() => setError("Failed to load product data."))
        .finally(() => setLoading(false));
    }
  }, [productId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "image" && !value) return;
        if (key === "is_returnable" || key === "is_exchangeable")
          fd.append(key, value ? "true" : "false");
        else if (value !== null && value !== "") fd.append(key, value);
      });
      if (isEditing)
        await api.patch(`/products/vendor/${productId}/`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      else await productService.createProduct(fd);
      navigate("/vendor/dashboard/products");
    } catch (err) {
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : isEditing
            ? "Failed to update."
            : "Failed to create.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader
        title={
          isEditing ? (
            <>
              Edit <em>Product</em>
            </>
          ) : (
            <>
              Add <em>Product</em>
            </>
          )
        }
        subtitle={
          isEditing
            ? "Update your product details"
            : "List a new product on Payivva"
        }
      />

      <div className="form-card vd-anim vd-a2">
        {error && (
          <div className="error-box">
            <AlertIcon />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          <div>
            <label className="vd-label">Product Name</label>
            <input
              type="text"
              required
              className="vd-input"
              placeholder="e.g. Handcrafted Leather Wallet"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="vd-label">Category {categories.length > 0 ? `(${categories.length} found)` : "(Loading...)"}</label>
            <select
              required
              className="vd-select"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="vd-label">Description</label>
            <textarea
              required
              className="vd-input"
              placeholder="Describe your product..."
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <div>
              <label className="vd-label">Price (₹)</label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontWeight: 700,
                    color: "var(--gold)",
                    fontSize: 15,
                    pointerEvents: "none",
                  }}
                >
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  className="vd-input"
                  style={{ paddingLeft: 32 }}
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="vd-label">Stock Qty</label>
              <input
                type="number"
                min="0"
                required
                className="vd-input"
                placeholder="e.g. 50"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="vd-label">Listing Status</label>
            <select
              className="vd-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="active">Active — visible to buyers</option>
              <option value="inactive">Inactive — hidden</option>
              <option value="pending">Pending — awaiting review</option>
            </select>
          </div>

          {/* Return / Exchange checkboxes */}
          <div>
            <label className="vd-label">Policies</label>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <label className="vd-checkbox-row">
                <input
                  type="checkbox"
                  checked={form.is_returnable}
                  onChange={(e) =>
                    setForm({ ...form, is_returnable: e.target.checked })
                  }
                  style={{ width: 16, height: 16, accentColor: "var(--gold)" }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--charcoal)",
                  }}
                >
                  Returnable
                </span>
              </label>
              <label className="vd-checkbox-row">
                <input
                  type="checkbox"
                  checked={form.is_exchangeable}
                  onChange={(e) =>
                    setForm({ ...form, is_exchangeable: e.target.checked })
                  }
                  style={{ width: 16, height: 16, accentColor: "var(--gold)" }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--charcoal)",
                  }}
                >
                  Exchangeable
                </span>
              </label>
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="vd-label">Product Image</label>
            {imagePreview && (
              <div style={{ marginBottom: 12 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 14,
                    border: "2px solid rgba(212,168,83,0.3)",
                  }}
                />
                <p
                  style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}
                >
                  {form.image
                    ? "New image selected"
                    : "Current image — upload to replace"}
                </p>
              </div>
            )}
            <label
              className="upload-zone"
              htmlFor="img-upload"
              style={{ display: "block" }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--charcoal)",
                  margin: "0 0 4px",
                }}
              >
                Click to upload image
              </p>
              <p style={{ fontSize: 11, color: "var(--muted)", margin: 0 }}>
                PNG, JPG up to 5MB
              </p>
              <input
                id="img-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) {
                    setForm({ ...form, image: f });
                    setImagePreview(URL.createObjectURL(f));
                  }
                }}
              />
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? (
              <>
                <div className="spinner" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                {isEditing ? "Update Product" : "Create Product"} <ArrowRight />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   VENDOR ORDERS
══════════════════════════════ */
function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    orderService
      .getVendorOrders()
      .then((data) => setOrders(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(fetchOrders, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update status.");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Items",
      "Total Price",
      "Status",
      "Date",
      "Tracking ID",
    ];
    const rows = orders.map((order) => {
      const statusObj = ORDER_STATUSES.find((s) => s.key === order.status);
      return [
        order.id,
        order.customer_email,
        order.items
          ?.map((i) => `${i.product_name} (${i.quantity})`)
          .join("; ") || "",
        order.total_price,
        statusObj
          ? statusObj.label || statusObj.key.replace(/_/g, " ")
          : order.status,
        new Date(order.created_at).toLocaleDateString("en-IN"),
        order.tracking_id,
      ];
    });
    const csv = [
      headers.join(","),
      ...rows.map((e) =>
        e.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleClean = () => {
    if (window.confirm("Remove all delivered orders from this view?"))
      setOrders((prev) => prev.filter((o) => o.status !== "delivered"));
  };

  return (
    <div>
      <PageHeader
        title={
          <>
            Vendor <em>Orders</em>
          </>
        }
        subtitle={`${orders.length} orders total`}
      >
        <button className="btn-ghost" onClick={handleClean}>
          <HiTrash style={{ width: 14, height: 14 }} /> Clean View
        </button>
        <button className="btn-gold" onClick={handleExportCSV}>
          <HiDownload style={{ width: 14, height: 14 }} /> Export CSV
        </button>
      </PageHeader>

      {loading ? (
        <Skeleton rows={4} />
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px" }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>📋</div>
          <h3
            className="vd-serif"
            style={{ fontSize: 20, color: "var(--charcoal)" }}
          >
            No orders <em>yet</em>
          </h3>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Orders will appear here once customers purchase your products.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {orders.map((order, i) => (
            <div
              key={order.id}
              className={`order-card vd-anim`}
              style={{
                animationDelay: `${0.05 + i * 0.06}s`,
                opacity: 0,
                animationFillMode: "forwards",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 4,
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        color: "var(--charcoal)",
                        margin: 0,
                      }}
                    >
                      Order #{order.id}
                    </p>
                    <span
                      className={`status-pill ${statusClass(order.status)}`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--muted)", margin: 0 }}>
                    Tracking: {order.tracking_id} &nbsp;·&nbsp;{" "}
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <p
                    style={{
                      fontWeight: 800,
                      fontSize: 18,
                      color: "var(--charcoal)",
                      margin: 0,
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {formatINR(order.total_price)}
                  </p>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusUpdate(order.id, e.target.value)
                    }
                    className="vd-select"
                    style={{
                      width: "auto",
                      padding: "8px 36px 8px 14px",
                      fontSize: 12,
                      borderRadius: 10,
                    }}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label || s.key.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 24,
                  paddingTop: 14,
                  borderTop: "1px solid rgba(44,40,32,0.07)",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      margin: "0 0 4px",
                    }}
                  >
                    Customer
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--charcoal)",
                      margin: 0,
                    }}
                  >
                    {order.customer_email}
                  </p>
                </div>
                {order.items && (
                  <div>
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--muted)",
                        margin: "0 0 4px",
                      }}
                    >
                      Items
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {order.items.map((item) => (
                        <p
                          key={item.id}
                          style={{
                            fontSize: 12,
                            color: "var(--muted)",
                            margin: 0,
                          }}
                        >
                          {item.product_name} × {item.quantity} &nbsp;=&nbsp;
                          <span
                            style={{
                              fontWeight: 600,
                              color: "var(--charcoal)",
                            }}
                          >
                            {formatINR(item.price * item.quantity)}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════
   MAIN LAYOUT
══════════════════════════════ */
function VendorProfile() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader
        title={
          <>
            Vendor <em>Profile</em>
          </>
        }
        subtitle="Manage your business information"
      />
      <div className="form-card vd-anim vd-a2">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "var(--gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: "var(--dark)",
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="vd-serif" style={{ margin: 0, fontSize: 24 }}>
              {user?.username}
            </h3>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
              {user?.email}
            </p>
            <div style={{ marginTop: 8 }}>
              <span className="status-pill s-active">Vendor Account</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
          }}
        >
          <div>
            <label className="vd-label">First Name</label>
            <input className="vd-input" value={user?.first_name || "N/A"} readOnly />
          </div>
          <div>
            <label className="vd-label">Last Name</label>
            <input className="vd-input" value={user?.last_name || "N/A"} readOnly />
          </div>
          <div>
            <label className="vd-label">Username</label>
            <input className="vd-input" value={user?.username || ""} readOnly />
          </div>
          <div>
            <label className="vd-label">Email Address</label>
            <input className="vd-input" value={user?.email || ""} readOnly />
          </div>
          <div>
            <label className="vd-label">Phone Number</label>
            <input className="vd-input" value={user?.phone || "N/A"} readOnly />
          </div>
          <div>
            <label className="vd-label">Account Type</label>
            <input
              className="vd-input"
              value={user?.role?.toUpperCase() || ""}
              readOnly
            />
          </div>
          <div>
            <label className="vd-label">Member Since</label>
            <input
              className="vd-input"
              value={
                user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "N/A"
              }
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VendorDashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <style>{styles}</style>
      <Helmet>
        <title>Vendor Dashboard — Payivva</title>
      </Helmet>

      <div
        className="pv-vd"
        style={{ display: "flex", minHeight: "calc(100vh - 5rem)" }}
      >
        <Sidebar />
        <main className="vd-main">
          <Routes>
            <Route index element={<VendorHome />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="products" element={<VendorProducts />} />
            <Route path="products/new" element={<VendorProductForm />} />
            <Route
              path="products/edit/:productId"
              element={<VendorProductForm />}
            />
            <Route path="orders" element={<VendorOrders />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
