import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Confetti from "react-confetti";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .pv-os {
    --gold: #D4A853;
    --gold-light: #F0C97A;
    --dark: #1A1814;
    --charcoal: #2C2820;
    --cream: #F5EDD8;
    --surface: #FFFCF5;
    font-family: 'DM Sans', sans-serif;
    background: var(--dark);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    overflow: hidden;
    position: relative;
  }

  .pv-os .os-card {
    background: linear-gradient(145deg, #FFFCF5 0%, #F5EDD8 100%);
    width: 100%;
    max-width: 600px;
    border-radius: 40px;
    padding: 60px 40px;
    text-align: center;
    position: relative;
    z-index: 10;
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
    animation: os-pop 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes os-pop {
    from { transform: scale(0.9) translateY(40px); opacity: 0; }
    to { transform: scale(1) translateY(0); opacity: 1; }
  }

  .pv-os .os-serif { font-family: 'Playfair Display', serif; }

  .pv-os .icon-circle {
    width: 80px; height: 80px;
    background: var(--gold);
    border-radius: 50%;
    margin: 0 auto 32px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 15px 35px rgba(212, 168, 83, 0.4);
    position: relative;
  }

  .pv-os .success-badge {
    font-size: 12px; font-weight: 800; color: var(--gold);
    letter-spacing: 0.15em; text-transform: uppercase;
    margin-bottom: 12px; display: block;
  }

  .pv-os h1 {
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 900; color: var(--charcoal);
    margin: 0 0 20px; line-height: 1.2;
  }

  .pv-os .quote-box {
    max-width: 480px; margin: 0 auto 40px;
    padding: 24px 0; border-top: 1px solid rgba(212, 168, 83, 0.2);
    border-bottom: 1px solid rgba(212, 168, 83, 0.2);
  }

  .pv-os .quote-text {
    font-family: 'Playfair Display', serif; font-size: 18px;
    font-style: italic; color: #5A5040; line-height: 1.6;
    margin: 0;
  }

  .pv-os .btn-group {
    display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
  }

  .pv-os .btn-primary {
    padding: 15px 32px; border-radius: 100px;
    background: var(--dark); color: var(--gold);
    font-weight: 700; font-size: 14px; text-decoration: none;
    transition: all 0.3s;
  }

  .pv-os .btn-primary:hover {
    transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  }

  .pv-os .btn-outline {
    padding: 15px 32px; border-radius: 100px;
    border: 1.5px solid var(--charcoal); color: var(--charcoal);
    font-weight: 700; font-size: 14px; text-decoration: none;
    transition: all 0.3s;
  }

  .pv-os .btn-outline:hover {
    background: var(--charcoal); color: var(--cream);
  }

  .logo-text { 
    font-family: 'Playfair Display', serif; 
    font-size: 20px; font-weight: 900; color: var(--gold);
    margin-bottom: 32px; display: block;
  }
`;

const quotes = [
  "Quality is not an act, it is a habit. Thank you for making it yours.",
  "Luxury must be comfortable, otherwise it is not luxury.",
  "Your choice reflects your vision for excellence.",
  "Success is about surrounding yourself with quality.",
  "Innovation starts with inspiration. Be inspired."
];

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <Helmet>
        <title>Order Confirmed — Payivva</title>
      </Helmet>

      <div className="pv-os">
        <Confetti 
          width={windowSize.width} 
          height={windowSize.height}
          colors={['#D4A853', '#F0C97A', '#2C2820', '#FFFFFF']}
          numberOfPieces={200}
          recycle={false}
        />

        <div className="os-card">
          <span className="logo-text">PAYIVVA</span>
          
          <div className="icon-circle">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1A1814" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <span className="success-badge">Payment Successful</span>
          <h1 className="os-serif">Order <em>Confirmed</em></h1>

          <div className="quote-box">
            <p className="quote-text">"{quote}"</p>
          </div>

          <div className="btn-group">
            <Link to="/orders" className="btn-primary">VIEW ORDERS</Link>
            <Link to="/products" className="btn-outline">SHOP MORE</Link>
          </div>
        </div>
      </div>
    </>
  );
}
