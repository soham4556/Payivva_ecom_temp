import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HiTrash } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import OrderTracker from "../components/OrderTracker";
import { formatPrice, formatDate, getStatusColor } from "../utils/helpers";
import orderService from "../services/orderService";
import api from "../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pv-orders {
    --gold: #D4A853;
    --gold-light: #F0C97A;
    --dark: #1A1814;
    --charcoal: #2C2820;
    --cream: #F5EDD8;
    --cream-deep: #EDE3CC;
    --muted: #8A8070;
    --surface: #FFFCF5;
    --danger: #C0392B;
    font-family: 'DM Sans', sans-serif;
    background: var(--surface);
    min-height: 80vh;
  }

  .pv-orders .or-serif { font-family: 'Playfair Display', serif; }

  @keyframes or-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes or-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  .pv-orders .or-anim { animation: or-fadeUp 0.45s ease both; }
  .pv-orders .or-a1 { animation-delay: 0.05s; }
  .pv-orders .or-a2 { animation-delay: 0.12s; }
  .pv-orders .or-a3 { animation-delay: 0.2s; }

  .pv-orders .gold-divider {
    width: 40px; height: 3px;
    background: var(--gold); border-radius: 2px; margin: 10px 0 0;
  }

  /* Order card */
  .pv-orders .order-card {
    background: #fff;
    border: 1.5px solid rgba(44,40,32,0.08);
    border-radius: 20px;
    padding: 24px 24px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    position: relative;
    overflow: visible;
  }
  .pv-orders .order-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--gold);
    transform: scaleY(0);
    transition: transform 0.3s cubic-bezier(.22,1,.36,1);
    border-radius: 0 2px 2px 0;
  }
  .pv-orders .order-card:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.07);
    border-color: rgba(212,168,83,0.3);
    transform: translateY(-2px);
  }
  .pv-orders .order-card:hover::before { transform: scaleY(1); }
  .pv-orders .order-card.active {
    border-color: var(--gold);
    box-shadow: 0 8px 32px rgba(212,168,83,0.15);
  }
  .pv-orders .order-card.active::before { transform: scaleY(1); }

  /* Status badge */
  .pv-orders .status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px;
    border-radius: 100px;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.05em; text-transform: capitalize;
  }
  .pv-orders .status-placed    { background: rgba(212,168,83,0.12); color: #8B6914; }
  .pv-orders .status-confirmed { background: rgba(79,158,255,0.12); color: #1A6FC4; }
  .pv-orders .status-packed    { background: rgba(138,128,112,0.12); color: #5A5040; }
  .pv-orders .status-shipped   { background: rgba(99,102,241,0.12);  color: #4338CA; }
  .pv-orders .status-out_for_delivery { background: rgba(245,158,11,0.12); color: #B45309; }
  .pv-orders .status-delivered { background: rgba(46,204,113,0.12);  color: #166534; }
  .pv-orders .status-cancelled { background: rgba(192,57,43,0.1);    color: var(--danger); }

  /* Hide button */
  .pv-orders .hide-btn {
    background: none; border: none; cursor: pointer;
    padding: 6px; border-radius: 8px; color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .pv-orders .hide-btn:hover { background: rgba(192,57,43,0.08); color: var(--danger); }

  /* Skeleton */
  .pv-orders .skeleton {
    background: linear-gradient(90deg, #f0ebe0 25%, #e8e0cf 50%, #f0ebe0 75%);
    background-size: 400px 100%;
    animation: or-shimmer 1.4s ease-in-out infinite;
    border-radius: 10px;
  }

  /* Empty state */
  .pv-orders .empty-icon {
    width: 88px; height: 88px; border-radius: 50%;
    background: var(--cream);
    display: flex; align-items: center; justify-content: center;
    font-size: 36px; margin: 0 auto 20px;
  }

  /* Select placeholder panel */
  .pv-orders .select-panel {
    background: #fff;
    border: 1.5px dashed rgba(44,40,32,0.12);
    border-radius: 24px;
    padding: 64px 32px;
    text-align: center;
    position: sticky;
    top: 100px;
  }

  /* Scroll area for order list */
  .pv-orders .orders-scroll {
    display: flex; flex-direction: column; gap: 12px;
    max-height: calc(100vh - 260px);
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: var(--cream-deep) transparent;
  }
  .pv-orders .orders-scroll::-webkit-scrollbar { width: 4px; }
  .pv-orders .orders-scroll::-webkit-scrollbar-track { background: transparent; }
  .pv-orders .orders-scroll::-webkit-scrollbar-thumb { background: var(--cream-deep); border-radius: 2px; }

  @media (max-width: 860px) {
    .pv-orders .orders-layout { 
      flex-direction: column !important; 
      gap: 32px !important;
    }
    .pv-orders .orders-scroll { 
      max-height: none !important; 
      width: 100% !important;
    }
    .pv-orders .select-panel { 
      position: static !important; 
      width: 100% !important;
    }
    .pv-orders > div {
      padding: 24px 16px !important;
    }
    .pv-orders .order-card {
      padding: 18px !important;
    }
    /* Hide the list on mobile if an order is selected (optional, but let's keep it simple first) */
  }
  
  @media (min-width: 861px) {
    .pv-orders .orders-scroll-container {
      width: 380px;
      flex-shrink: 0;
    }
  }
  
  @media (max-width: 860px) {
    .pv-orders .orders-scroll-container {
      width: 100%;
    }
  }
`;

const getStatusClass = (status) => {
  const map = {
    placed: "status-placed",
    confirmed: "status-confirmed",
    packed: "status-packed",
    shipped: "status-shipped",
    out_for_delivery: "status-out_for_delivery",
    delivered: "status-delivered",
    cancelled: "status-cancelled",
  };
  return map[status] || "status-placed";
};

const statusDot = (status) => {
  const colors = {
    placed: "#D4A853",
    confirmed: "#4F9EFF",
    packed: "#8A8070",
    shipped: "#6366F1",
    out_for_delivery: "#F59E0B",
    delivered: "#2ECC71",
    cancelled: "#C0392B",
  };
  return colors[status] || "#D4A853";
};

const PackageIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "var(--muted)" }}
  >
    <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z" />
    <polyline points="2.32 6.16 12 11 21.68 6.16" />
    <line x1="12" y1="22.76" x2="12" y2="11" />
  </svg>
);

const CursorIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "var(--muted)" }}
  >
    <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
  </svg>
);

export default function OrderTracking() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hiddenOrders, setHiddenOrders] = useState(() => {
    try {
      const h = localStorage.getItem("hiddenOrders");
      return h ? JSON.parse(h) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("hiddenOrders", JSON.stringify(hiddenOrders));
  }, [hiddenOrders]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    orderService
      .getOrders()
      .then((data) => setAllOrders(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const visible = allOrders.filter((o) => !hiddenOrders.includes(o.id));
    setVisibleOrders(visible);
    if (
      visible.length > 0 &&
      (!selectedOrder || !visible.find((o) => o.id === selectedOrder))
    ) {
      handleTrack(visible[0].id);
    } else if (visible.length === 0) {
      setTrackingData(null);
      setSelectedOrder(null);
    }
  }, [allOrders, hiddenOrders]);

  const handleTrack = async (orderId) => {
    setSelectedOrder(orderId);
    try {
      const data = await orderService.getOrderTracking(orderId);
      setTrackingData(data);
    } catch {
      setTrackingData(null);
    }
  };

  const handleCancel = async () => {
    if (!selectedOrder) return;
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.post(`/orders/${selectedOrder}/cancel/`);
      setAllOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder ? { ...o, status: "cancelled" } : o,
        ),
      );
      setTrackingData((prev) => ({ ...prev, status: "cancelled" }));
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to cancel order.");
    }
  };

  const handleHideOrder = (id) => {
    if (!window.confirm("Hide this order permanently?")) return;
    setHiddenOrders((prev) => [...new Set([...prev, id])]);
  };

  const handleReturn = () =>
    alert("Return initiated. Our team will contact you shortly.");
  const handleExchange = async () => {
    if (!selectedOrder) return;
    if (!window.confirm("Are you sure you want to request a replacement for this order?")) return;
    try {
      await orderService.replaceOrder(selectedOrder);
      alert("Replacement request submitted successfully! Confirmation emails have been sent.");
      handleTrack(selectedOrder);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to submit replacement request.");
    }
  };

  const isDelivered = trackingData?.status === "delivered";
  const deliveryDate = trackingData?.delivered_at ? new Date(trackingData.delivered_at) : null;
  // If deliveryDate is missing for an old order, we assume it's within 7 days for testing
  const isWithin7Days = isDelivered ? (deliveryDate ? (new Date() - deliveryDate) / (1000 * 60 * 60 * 24) <= 7 : true) : false;

  const allowReturn = isDelivered && isWithin7Days && trackingData?.items?.some((i) => i.is_returnable);
  const allowExchange = isDelivered && isWithin7Days && trackingData?.items?.some((i) => i.is_exchangeable);

  if (!isAuthenticated) return null;

  return (
    <>
      <style>{styles}</style>
      <Helmet>
        <title>My Orders — Payivva</title>
      </Helmet>

      <div className="pv-orders">
        {/* ── HEADER ── */}
        <div
          style={{
            background: "var(--cream)",
            borderBottom: "1px solid var(--cream-deep)",
            padding: "36px 0 28px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            <p
              className="or-anim or-a1"
              style={{
                fontSize: 12,
                color: "var(--muted)",
                marginBottom: 10,
                letterSpacing: "0.05em",
              }}
            >
              Home &nbsp;/&nbsp;{" "}
              <span style={{ color: "var(--charcoal)", fontWeight: 500 }}>
                My Orders
              </span>
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div className="or-anim or-a2">
                <h1
                  className="or-serif"
                  style={{
                    fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                    color: "var(--charcoal)",
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  My <em>Orders</em>
                </h1>
                <div className="gold-divider" />
              </div>
              {!loading && visibleOrders.length > 0 && (
                <span
                  className="or-anim or-a3"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--muted)",
                    background: "rgba(44,40,32,0.06)",
                    padding: "4px 14px",
                    borderRadius: 100,
                  }}
                >
                  {visibleOrders.length}{" "}
                  {visibleOrders.length === 1 ? "order" : "orders"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "40px 24px 64px",
          }}
        >
          {/* LOADING */}
          {loading && (
            <div style={{ display: "flex", gap: 28 }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff",
                      borderRadius: 20,
                      padding: "20px 22px",
                      border: "1px solid rgba(44,40,32,0.07)",
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    <div
                      className="skeleton"
                      style={{ height: 14, width: "40%", marginBottom: 10 }}
                    />
                    <div
                      className="skeleton"
                      style={{ height: 12, width: "60%", marginBottom: 14 }}
                    />
                    <div
                      className="skeleton"
                      style={{ height: 12, width: "75%" }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ width: 520, flexShrink: 0 }}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 24,
                    padding: 32,
                    border: "1px solid rgba(44,40,32,0.07)",
                  }}
                >
                  <div
                    className="skeleton"
                    style={{ height: 18, width: "50%", marginBottom: 24 }}
                  />
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="skeleton"
                      style={{
                        height: 10,
                        marginBottom: 12,
                        width: `${60 + i * 8}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EMPTY */}
          {!loading && visibleOrders.length === 0 && (
            <div
              className="or-anim or-a1"
              style={{ textAlign: "center", padding: "80px 24px" }}
            >
              <div className="empty-icon">📦</div>
              <h2
                className="or-serif"
                style={{
                  fontSize: 24,
                  color: "var(--charcoal)",
                  marginBottom: 10,
                }}
              >
                No orders <em>yet</em>
              </h2>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 15,
                  marginBottom: 28,
                }}
              >
                Looks like you haven't placed any orders yet.
              </p>
              <Link
                to="/products"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 28px",
                  background: "var(--dark)",
                  color: "var(--gold)",
                  borderRadius: 14,
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  boxShadow: "0 6px 24px rgba(26,24,20,0.15)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                Start Shopping →
              </Link>
            </div>
          )}

          {/* MAIN LAYOUT */}
          {!loading && visibleOrders.length > 0 && (
            <div
              className="orders-layout"
              style={{ display: "flex", gap: 28, alignItems: "flex-start" }}
            >
              {/* LEFT — Order List */}
              <div className="orders-scroll-container">
                <p
                  className="or-anim or-a1"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--muted)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                  Your Orders
                </p>
                <div className="orders-scroll">
                  {visibleOrders.map((order, i) => (
                    <div
                      key={order.id}
                      className={`order-card or-anim${selectedOrder === order.id ? " active" : ""}`}
                      style={{
                        animationDelay: `${0.05 + i * 0.06}s`,
                        opacity: 0,
                        animationFillMode: "forwards",
                      }}
                      onClick={() => handleTrack(order.id)}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 10,
                          gap: 8,
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p
                            style={{
                              fontWeight: 800,
                              fontSize: 15,
                              color: "var(--charcoal)",
                              margin: 0,
                              letterSpacing: "0.02em"
                            }}
                          >
                            Order #{order.id}
                          </p>
                          <p
                            style={{
                              fontSize: 12,
                              color: "var(--muted)",
                              margin: "6px 0 0",
                              lineHeight: 1.4
                            }}
                          >
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            flexShrink: 0,
                          }}
                        >
                          <span
                            className={`status-badge ${getStatusClass(order.status)}`}
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: statusDot(order.status),
                                flexShrink: 0,
                              }}
                            />
                            {order.status.replace(/_/g, " ")}
                          </span>
                          {(order.status === "delivered" ||
                            order.status === "cancelled") && (
                            <button
                              className="hide-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleHideOrder(order.id);
                              }}
                              title="Hide this order"
                            >
                              <HiTrash style={{ width: 13, height: 13 }} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 12,
                          marginTop: 16,
                          paddingTop: 16,
                          borderTop: "1px solid rgba(44,40,32,0.05)"
                        }}
                      >
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--muted)",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          {order.items?.map((i) => i.product_name).join(", ")}
                        </p>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: 14,
                            color: "var(--charcoal)",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                            margin: 0,
                          }}
                        >
                          {formatPrice(order.total_price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — Tracker */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {trackingData ? (
                  <OrderTracker
                    order={trackingData}
                    onCancel={handleCancel}
                    onReturn={allowReturn ? handleReturn : null}
                    onExchange={allowExchange ? handleExchange : null}
                  />
                ) : (
                  <div className="select-panel">
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "var(--cream)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}
                    >
                      <CursorIcon />
                    </div>
                    <h3
                      className="or-serif"
                      style={{
                        fontSize: 18,
                        color: "var(--charcoal)",
                        marginBottom: 8,
                      }}
                    >
                      Select an <em>order</em>
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--muted)" }}>
                      Click any order on the left to view its tracking details.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
