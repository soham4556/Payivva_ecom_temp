import { useState, useEffect } from "react";

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    background: "rgba(5,7,10,0.93)",
    backdropFilter: "blur(16px)",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    background: "#0A0E1A",
    borderRadius: "28px",
    border: "1px solid rgba(212,175,55,0.25)",
    overflow: "hidden",
    position: "relative",
    animation: "zoomIn 0.3s ease",
  },
  shimmerBar: {
    height: "3px",
    width: "100%",
    background:
      "linear-gradient(90deg, transparent, #D4AF37, #F5D97A, #D4AF37, transparent)",
    backgroundSize: "300% auto",
    animation: "shimmer 3s linear infinite",
  },
  body: {
    padding: "2.5rem 2rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  logoBadge: {
    marginBottom: "1.5rem",
    background: "#0F1525",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "16px",
    padding: "0.75rem 1.25rem",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },
  logoIcon: {
    fontSize: "20px",
    color: "#D4AF37",
  },
  logoText: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#F0EDD8",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  iconRingWrapper: {
    position: "relative",
    marginBottom: "1.5rem",
  },
  outerRing: {
    width: "88px",
    height: "88px",
    borderRadius: "50%",
    border: "2px solid rgba(74,222,128,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "pulseRing 2s ease-in-out infinite",
  },
  innerCircle: {
    width: "68px",
    height: "68px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4ade80, #16a34a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "3px solid #0A0E1A",
    fontSize: "30px",
    color: "#fff",
  },
  sparkleTR: {
    position: "absolute",
    top: "-4px",
    right: "-6px",
    fontSize: "18px",
    color: "#D4AF37",
    animation: "bounceY 1.5s ease-in-out infinite",
  },
  sparkleBL: {
    position: "absolute",
    bottom: "-2px",
    left: "-6px",
    fontSize: "13px",
    color: "rgba(212,175,55,0.5)",
    animation: "pulseFade 2s ease-in-out infinite",
  },
  subtitle: {
    fontSize: "11px",
    fontWeight: 500,
    color: "#D4AF37",
    letterSpacing: "0.35em",
    textTransform: "uppercase",
    margin: "0 0 6px",
  },
  title: {
    fontSize: "26px",
    fontWeight: 500,
    color: "#F0EDD8",
    margin: "0 0 1rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  divider: {
    width: "60px",
    height: "1px",
    background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
    marginBottom: "1.25rem",
  },
  message: {
    fontSize: "14px",
    color: "rgba(240,237,216,0.7)",
    lineHeight: 1.7,
    maxWidth: "320px",
    margin: "0 0 1.75rem",
  },
  highlight: {
    color: "#D4AF37",
    fontStyle: "italic",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(212,175,55,0.1)",
    borderRadius: "14px",
    padding: "1rem 0",
    marginBottom: "1.75rem",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  statValue: {
    fontSize: "18px",
    fontWeight: 500,
    color: "#D4AF37",
  },
  statLabel: {
    fontSize: "10px",
    color: "rgba(240,237,216,0.45)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  statDivider: {
    background: "rgba(212,175,55,0.15)",
  },
  ctaButton: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #D4AF37, #B8921E)",
    color: "#0A0E1A",
    border: "none",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    letterSpacing: "0.05em",
    transition: "transform 0.15s, opacity 0.15s",
  },
  footer: {
    marginTop: "1.5rem",
    fontSize: "9px",
    color: "rgba(240,237,216,0.2)",
    letterSpacing: "0.5em",
    textTransform: "uppercase",
  },
};

const keyframes = `
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes zoomIn {
    from { transform: scale(0.92); opacity: 0; }
    to   { transform: scale(1);    opacity: 1; }
  }
  @keyframes pulseRing {
    0%,100% { box-shadow: 0 0 0 0   rgba(74,222,128,0.15); }
    50%     { box-shadow: 0 0 0 10px rgba(74,222,128,0);    }
  }
  @keyframes bounceY {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-5px); }
  }
  @keyframes pulseFade {
    0%,100% { opacity: 0.4; }
    50%     { opacity: 1; }
  }
`;

export default function SuccessModal({ isOpen, onClose }) {
  const [btnHover, setBtnHover] = useState(false);
  const [btnActive, setBtnActive] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{keyframes}</style>

      {/* Overlay */}
      <div style={styles.overlay} onClick={onClose}>
        {/* Modal Card */}
        <div style={styles.card} onClick={(e) => e.stopPropagation()}>
          {/* Shimmer top bar */}
          <div style={styles.shimmerBar} />

          <div style={styles.body}>
            {/* Logo badge */}
            <div style={styles.logoBadge}>
              <span style={styles.logoIcon}>◆</span>
              <span style={styles.logoText}>Payivva</span>
            </div>

            {/* Animated success icon */}
            <div style={styles.iconRingWrapper}>
              <div style={styles.outerRing}>
                <div style={styles.innerCircle}>✓</div>
              </div>
              <span style={styles.sparkleTR} aria-hidden="true">
                ✦
              </span>
              <span style={styles.sparkleBL} aria-hidden="true">
                ✦
              </span>
            </div>

            {/* Headings */}
            <p style={styles.subtitle}>Welcome to the</p>
            <h2 style={styles.title}>Payivva Family</h2>

            {/* Gold divider */}
            <div style={styles.divider} />

            {/* Message */}
            <p style={styles.message}>
              Your journey into{" "}
              <span style={styles.highlight}>Inspiring Innovations</span> begins
              today. Everything is set for your first premium experience.
            </p>

            {/* Stats row */}
            <div style={styles.statsRow}>
              <div style={styles.statItem}>
                <span style={styles.statValue}>24/7</span>
                <span style={styles.statLabel}>Support</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <span style={styles.statValue}>100%</span>
                <span style={styles.statLabel}>Secure</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <span style={styles.statValue}>Premium</span>
                <span style={styles.statLabel}>Access</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onClose}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => {
                setBtnHover(false);
                setBtnActive(false);
              }}
              onMouseDown={() => setBtnActive(true)}
              onMouseUp={() => setBtnActive(false)}
              style={{
                ...styles.ctaButton,
                opacity: btnHover ? 0.88 : 1,
                transform: btnActive ? "scale(0.97)" : "scale(1)",
              }}
            >
              Go to Login
              <span style={{ fontSize: "17px" }}>→</span>
            </button>

            {/* Footer label */}
            <p style={styles.footer}>Technologies</p>
          </div>
        </div>
      </div>
    </>
  );
}
