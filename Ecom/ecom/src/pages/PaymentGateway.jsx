import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";
import orderService from "../services/orderService";
import SuccessModal from "../components/SuccessModal";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pv-pay {
    --gold: #D4A853;
    --gold-light: #F0C97A;
    --dark: #1A1814;
    --charcoal: #2C2820;
    --cream: #F5EDD8;
    --surface: #FFFCF5;
    --success: #2ECC71;
    font-family: 'DM Sans', sans-serif;
    background: var(--dark);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    color: var(--cream);
  }

  .pv-pay .pay-card {
    background: rgba(44, 40, 32, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(212, 168, 83, 0.15);
    border-radius: 32px;
    width: 100%;
    max-width: 900px;
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    animation: pay-fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes pay-fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .pv-pay .pay-sidebar {
    background: rgba(212, 168, 83, 0.05);
    padding: 48px;
    border-right: 1px solid rgba(212, 168, 83, 0.1);
  }

  .pv-pay .pay-main {
    padding: 48px;
    background: rgba(26, 24, 20, 0.4);
  }

  .pv-pay .pay-serif { font-family: 'Playfair Display', serif; }

  .pv-pay .summary-item {
    display: flex; justify-content: space-between;
    margin-bottom: 16px; font-size: 14px; color: rgba(245, 237, 216, 0.6);
  }

  .pv-pay .total-row {
    margin-top: 32px; padding-top: 24px;
    border-top: 1px solid rgba(212, 168, 83, 0.2);
    display: flex; justify-content: space-between; align-items: baseline;
  }

  .pv-pay .method-btn {
    width: 100%; display: flex; align-items: center; gap: 12px;
    padding: 16px 20px; border-radius: 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1.5px solid rgba(212, 168, 83, 0.1);
    color: var(--cream); cursor: pointer; transition: all 0.3s;
    margin-bottom: 12px; font-weight: 500;
  }

  .pv-pay .method-btn:hover {
    background: rgba(212, 168, 83, 0.08);
    border-color: var(--gold);
  }

  .pv-pay .method-btn.active {
    background: rgba(212, 168, 83, 0.15);
    border-color: var(--gold);
    box-shadow: 0 0 15px rgba(212, 168, 83, 0.2);
  }

  .pv-pay .pay-btn {
    width: 100%; margin-top: 32px;
    padding: 18px; border-radius: 16px;
    background: var(--gold); color: var(--dark);
    font-weight: 800; font-size: 16px; border: none;
    cursor: pointer; transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: 0 10px 25px rgba(212, 168, 83, 0.3);
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }

  .pv-pay .pay-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(212, 168, 83, 0.4);
    background: var(--gold-light);
  }

  .pv-pay .pay-btn:disabled {
    opacity: 0.6; cursor: not-allowed;
  }

  .pv-pay .spinner {
    width: 20px; height: 20px;
    border: 3px solid rgba(26, 24, 20, 0.2);
    border-top-color: var(--dark);
    border-radius: 50%; animation: pay-spin 0.8s linear infinite;
  }

  @keyframes pay-spin { to { transform: rotate(360deg); } }

  .pv-pay .trust-badge {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; color: rgba(212, 168, 83, 0.4);
    margin-top: 24px; justify-content: center;
  }

  @media (max-width: 800px) {
    .pv-pay .pay-card { grid-template-columns: 1fr; }
    .pv-pay .pay-sidebar { padding: 32px; border-right: none; border-bottom: 1px solid rgba(212, 168, 83, 0.1); }
    .pv-pay .pay-main { padding: 32px; }
  }
`;

export default function PaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart } = useCart();
  const [method, setMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const orderData = location.state?.orderData;

  useEffect(() => {
    if (!orderData) navigate("/checkout");
  }, [orderData, navigate]);

  const handlePayment = async () => {
    setLoading(true);
    // Simulate payment delay
    setTimeout(async () => {
      try {
        await orderService.createOrder(orderData);
        clearCart();
        setLoading(false);
        navigate("/order-success");
      } catch (err) {
        alert("Payment failed. Please try again.");
        setLoading(false);
      }
    }, 2500);
  };

  if (!orderData) return null;

  return (
    <>
      <style>{styles}</style>
      <Helmet>
        <title>Secure Payment — Payivva</title>
      </Helmet>

      <div className="pv-pay">
        <div className="pay-card">
          {/* Order Summary Sidebar */}
          <div className="pay-sidebar">
            <h2 className="pay-serif" style={{ fontSize: 24, color: "var(--gold)", marginBottom: 32 }}>
              Order <em>Summary</em>
            </h2>
            
            <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 24 }}>
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span style={{ color: "var(--cream)" }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="total-row">
              <span style={{ fontSize: 18, fontWeight: 600 }}>Amount to Pay</span>
              <span className="pay-serif" style={{ fontSize: 28, color: "var(--gold)", fontWeight: 900 }}>
                ₹{orderData.total_price || location.state?.grandTotal}
              </span>
            </div>

            <div className="trust-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              100% SECURE TRANSACTION
            </div>
          </div>

          {/* Payment Options Main */}
          <div className="pay-main">
            <h3 className="pay-serif" style={{ fontSize: 22, marginBottom: 8 }}>Select <em>Payment Method</em></h3>
            <p style={{ fontSize: 13, color: "rgba(245, 237, 216, 0.4)", marginBottom: 32 }}>Choose your preferred way to pay</p>

            <button className={`method-btn ${method === "upi" ? "active" : ""}`} onClick={() => setMethod("upi")}>
              <span style={{ fontSize: 20 }}>📱</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>UPI (PhonePe / Google Pay)</div>
                <div style={{ fontSize: 11, opacity: 0.5 }}>Pay using any UPI App</div>
              </div>
            </button>

            <button className={`method-btn ${method === "card" ? "active" : ""}`} onClick={() => setMethod("card")}>
              <span style={{ fontSize: 20 }}>💳</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Credit / Debit Card</div>
                <div style={{ fontSize: 11, opacity: 0.5 }}>Visa, Mastercard, RuPay</div>
              </div>
            </button>

            <button className={`method-btn ${method === "net" ? "active" : ""}`} onClick={() => setMethod("net")}>
              <span style={{ fontSize: 20 }}>🏦</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Net Banking</div>
                <div style={{ fontSize: 11, opacity: 0.5 }}>All major Indian banks</div>
              </div>
            </button>

            <button className="pay-btn" onClick={handlePayment} disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  PAY NOW ₹{orderData.total_price || location.state?.grandTotal}
                </>
              )}
            </button>

            <div style={{ textAlign: "center", marginTop: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", opacity: 0.4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>VISA</span>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>MASTERCARD</span>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>RUPAY</span>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>PAYPAL</span>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <SuccessModal 
          isOpen={showSuccess} 
          onClose={() => navigate("/vendor/dashboard/orders")} 
        />
      )}
    </>
  );
}
