import {
  HiClipboardList,
  HiCheckCircle,
  HiArchive,
  HiTruck,
  HiHome,
  HiXCircle,
} from "react-icons/hi";
import { formatDate } from "../utils/helpers";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pv-tracker {
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

  .pv-tracker .tr-serif { font-family: 'Playfair Display', serif; }

  @keyframes tr-fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes tr-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(212,168,83,0.5); }
    50%       { box-shadow: 0 0 0 8px rgba(212,168,83,0); }
  }
  @keyframes tr-spin { to { transform: rotate(360deg); } }
  @keyframes tr-progress {
    from { width: 0; }
    to   { width: 100%; }
  }

  .pv-tracker .tr-anim { animation: tr-fadeUp 0.5s ease both; }

  /* Step connector line */
  .pv-tracker .step-line-fill {
    animation: tr-progress 0.6s ease both;
  }

  /* Current step pulse */
  .pv-tracker .step-current {
    animation: tr-pulse 2s ease-in-out infinite;
  }

  /* Action buttons */
  .pv-tracker .btn-cancel {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px;
    background: transparent;
    border: 1.5px solid rgba(192,57,43,0.25);
    border-radius: 10px;
    color: var(--danger);
    font-size: 12px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.25s;
  }
  .pv-tracker .btn-cancel:hover {
    background: rgba(192,57,43,0.08);
    border-color: rgba(192,57,43,0.5);
  }

  .pv-tracker .btn-action {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px;
    background: transparent;
    border: 1.5px solid rgba(44,40,32,0.15);
    border-radius: 10px;
    color: var(--charcoal);
    font-size: 12px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.25s;
  }
  .pv-tracker .btn-action:hover {
    background: var(--dark);
    border-color: var(--dark);
    color: var(--gold);
  }

  /* History timeline dot */
  .pv-tracker .history-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--gold);
    flex-shrink: 0; margin-top: 5px;
    box-shadow: 0 0 0 3px rgba(212,168,83,0.2);
  }
  .pv-tracker .history-dot.latest {
    background: var(--gold);
    box-shadow: 0 0 0 4px rgba(212,168,83,0.25);
    animation: tr-pulse 2s ease-in-out infinite;
  }
  .pv-tracker .history-dot.old {
    background: rgba(44,40,32,0.2);
    box-shadow: none;
  }

  /* Cancelled banner */
  .pv-tracker .cancelled-banner {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 18px;
    background: rgba(192,57,43,0.06);
    border: 1px solid rgba(192,57,43,0.18);
    border-radius: 14px;
    margin-bottom: 24px;
  }

  /* Tracking ID chip */
  .pv-tracker .tracking-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px;
    background: rgba(212,168,83,0.1);
    border: 1px solid rgba(212,168,83,0.25);
    border-radius: 100px;
    font-size: 11px; font-weight: 700;
    color: #8B6914;
    letter-spacing: 0.06em;
  }

  /* Step node */
  .pv-tracker .step-node {
    width: 44px; height: 44px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: all 0.3s;
  }
  .pv-tracker .step-node.done {
    background: var(--dark);
    box-shadow: 0 4px 16px rgba(26,24,20,0.2);
  }
  .pv-tracker .step-node.current {
    background: var(--gold);
    box-shadow: 0 4px 20px rgba(212,168,83,0.4);
  }
  .pv-tracker .step-node.idle {
    background: rgba(44,40,32,0.07);
  }

  @media (max-width: 600px) {
    .pv-tracker .steps-row { gap: 0 !important; }
    .pv-tracker .step-label { font-size: 9px !important; }
    .pv-tracker .step-node { width: 36px !important; height: 36px !important; }
  }
`;

const STATUS_CONFIG = {
  placed: { icon: HiClipboardList, label: "Placed", emoji: "📋" },
  confirmed: { icon: HiCheckCircle, label: "Confirmed", emoji: "✅" },
  packed: { icon: HiArchive, label: "Packed", emoji: "📦" },
  shipped: { icon: HiTruck, label: "Shipped", emoji: "🚚" },
  out_for_delivery: { icon: HiTruck, label: "Out for\nDelivery", emoji: "🛵" },
  delivered: { icon: HiHome, label: "Delivered", emoji: "🏠" },
};

const STATUS_FLOW = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const XIcon = ({ size = 13 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const RefreshIcon = ({ size = 13 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const SwapIcon = ({ size = 13 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

export default function OrderTracker({
  order,
  onCancel,
  onReturn,
  onExchange,
}) {
  if (!order) return null;

  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);
  const isCancelled = order.status === "cancelled";
  
  // Logic for Cancellation
  const allItemsCancellable = order.items?.every(i => i.is_cancellable) ?? true;
  const canCancel = !isCancelled && ["placed", "confirmed", "packed"].includes(order.status) && allItemsCancellable;

  // Logic for Return (6 days window)
  let canReturn = false;
  if (order.status === "delivered" && order.delivered_at) {
    const deliveredDate = new Date(order.delivered_at);
    const sixDaysInMs = 6 * 24 * 60 * 60 * 1000;
    const isWithinSixDays = (Date.now() - deliveredDate.getTime()) < sixDaysInMs;
    const hasReturnableItem = order.items?.some(i => i.is_returnable);
    if (isWithinSixDays && hasReturnableItem) {
      canReturn = true;
    }
  }

  const progressPercent = isCancelled
    ? 0
    : Math.round((currentStatusIndex / (STATUS_FLOW.length - 1)) * 100);

  return (
    <>
      <style>{styles}</style>
      <div
        className="pv-tracker tr-anim"
        style={{
          background: "#fff",
          border: "1px solid rgba(44,40,32,0.08)",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <h3
                className="tr-serif"
                style={{ fontSize: 18, color: "var(--charcoal)", margin: 0 }}
              >
                Order <em>Tracking</em>
              </h3>
            </div>
            <span className="tracking-chip">#{order.tracking_id}</span>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {onCancel && ["placed", "confirmed", "packed"].includes(order.status) && (
              <button className="btn-cancel" onClick={onCancel}>
                <XIcon /> Cancel Order
              </button>
            )}
            {onReturn && (
              <button className="btn-action" onClick={onReturn}>
                <RefreshIcon /> Return
              </button>
            )}
            {onExchange && (
              <button className="btn-action" onClick={onExchange}>
                <SwapIcon /> Exchange
              </button>
            )}
          </div>
        </div>

        {/* ── CANCELLED BANNER ── */}
        {isCancelled && (
          <div className="cancelled-banner">
            <HiXCircle
              style={{
                color: "var(--danger)",
                width: 20,
                height: 20,
                flexShrink: 0,
              }}
            />
            <div>
              <p
                style={{
                  color: "var(--danger)",
                  fontWeight: 700,
                  fontSize: 14,
                  margin: 0,
                }}
              >
                Order Cancelled
              </p>
              <p
                style={{
                  color: "rgba(192,57,43,0.7)",
                  fontSize: 12,
                  margin: "2px 0 0",
                }}
              >
                This order has been cancelled. Refund will be processed in 5–7
                business days.
              </p>
            </div>
          </div>
        )}

        {/* ── PROGRESS BAR ── */}
        {!isCancelled && (
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}
              >
                {STATUS_CONFIG[order.status]?.label || order.status}
              </span>
              <span
                style={{ fontSize: 12, color: "var(--gold)", fontWeight: 700 }}
              >
                {progressPercent}%
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: "rgba(44,40,32,0.08)",
                borderRadius: 100,
                overflow: "hidden",
              }}
            >
              <div
                className="step-line-fill"
                style={{
                  height: "100%",
                  width: `${progressPercent}%`,
                  background:
                    "linear-gradient(to right, var(--dark), var(--gold))",
                  borderRadius: 100,
                  transition: "width 0.8s cubic-bezier(.22,1,.36,1)",
                }}
              />
            </div>
          </div>
        )}

        {/* ── STEPPER ── */}
        {!isCancelled && (
          <div
            className="steps-row"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 4,
              marginBottom: 32,
            }}
          >
            {STATUS_FLOW.map((status, index) => {
              const isDone = index < currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const isIdle = index > currentStatusIndex;
              const Icon = STATUS_CONFIG[status].icon;
              const label = STATUS_CONFIG[status].label;

              return (
                <div
                  key={status}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {/* Connector line left */}
                  {index > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 22,
                        right: "50%",
                        width: "calc(100% - 22px)",
                        height: 2,
                        background:
                          isDone || isCurrent
                            ? "var(--gold)"
                            : "rgba(44,40,32,0.08)",
                        transition: "background 0.4s",
                        zIndex: 0,
                      }}
                    />
                  )}

                  {/* Node */}
                  <div
                    className={`step-node ${isDone ? "done" : isCurrent ? "current step-current" : "idle"}`}
                    style={{ position: "relative", zIndex: 1 }}
                  >
                    <Icon
                      style={{
                        width: 20,
                        height: 20,
                        color: isDone
                          ? "var(--gold)"
                          : isCurrent
                            ? "var(--dark)"
                            : "var(--muted)",
                      }}
                    />
                  </div>

                  {/* Label */}
                  <p
                    className="step-label"
                    style={{
                      fontSize: 10,
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent
                        ? "var(--charcoal)"
                        : isDone
                          ? "var(--gold)"
                          : "var(--muted)",
                      marginTop: 8,
                      textAlign: "center",
                      lineHeight: 1.3,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* ── ITEMS ── */}
        <div style={{ borderTop: "1px solid rgba(44,40,32,0.07)", paddingTop: 24, marginBottom: 32 }}>
          <h4 className="tr-serif" style={{ fontSize: 16, color: "var(--charcoal)", marginBottom: 20 }}>
            Order <em>Items</em>
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {order.items?.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <img 
                  src={item.image || "https://via.placeholder.com/60"} 
                  alt={item.product_name} 
                  style={{ width: 60, height: 60, borderRadius: 12, objectFit: "cover", background: "var(--surface)" }} 
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--charcoal)", margin: 0 }}>{item.product_name}</p>
                  <p style={{ fontSize: 12, color: "var(--muted)", margin: "4px 0 0" }}>Qty: {item.quantity}</p>
                </div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "var(--charcoal)", margin: 0 }}>₹{new Intl.NumberFormat("en-IN").format(item.price)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── HISTORY ── */}
        <div
          style={{ borderTop: "1px solid rgba(44,40,32,0.07)", paddingTop: 24 }}
        >
          <h4
            className="tr-serif"
            style={{ fontSize: 16, color: "var(--charcoal)", marginBottom: 20 }}
          >
            Status <em>History</em>
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {(order.status_history || []).map((history, index) => {
              const isLatest = index === 0;
              const isLast = index === (order.status_history?.length || 0) - 1;

              return (
                <div
                  key={history.id}
                  style={{ display: "flex", gap: 16, position: "relative" }}
                >
                  {/* Timeline */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexShrink: 0,
                      width: 10,
                    }}
                  >
                    <div
                      className={`history-dot ${isLatest ? "latest" : "old"}`}
                    />
                    {!isLast && (
                      <div
                        style={{
                          width: 1,
                          flex: 1,
                          minHeight: 32,
                          background: isLatest
                            ? "linear-gradient(to bottom, rgba(212,168,83,0.4), rgba(212,168,83,0.1))"
                            : "rgba(44,40,32,0.08)",
                          margin: "4px 0",
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ paddingBottom: isLast ? 0 : 20, flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 2,
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          color: isLatest ? "var(--charcoal)" : "var(--muted)",
                          margin: 0,
                          textTransform: "capitalize",
                        }}
                      >
                        {history.status.replace(/_/g, " ")}
                      </p>
                      {isLatest && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.07em",
                            color: "#8B6914",
                            background: "rgba(212,168,83,0.12)",
                            border: "1px solid rgba(212,168,83,0.25)",
                            padding: "1px 8px",
                            borderRadius: 100,
                          }}
                        >
                          LATEST
                        </span>
                      )}
                    </div>
                    {history.note && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                          margin: "2px 0 4px",
                          lineHeight: 1.5,
                        }}
                      >
                        {history.note}
                      </p>
                    )}
                    <p
                      style={{
                        fontSize: 11,
                        color: "rgba(138,128,112,0.6)",
                        margin: 0,
                      }}
                    >
                      {formatDate(history.updated_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
