import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pv-footer {
    --gold: #D4A853;
    --gold-light: #F0C97A;
    --dark: #1A1814;
    --charcoal: #2C2820;
    --cream: #F5EDD8;
    --muted: #8A8070;
    --surface: #FFFCF5;

    background: var(--dark);
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
    margin-top: auto;
  }

  /* Top gold shimmer rule */
  .pv-footer .ft-top-rule {
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
  }

  /* Subtle background texture */
  .pv-footer .ft-bg-glow {
    position: absolute; bottom: -120px; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 300px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(212,168,83,0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .pv-footer .ft-inner {
    max-width: 1180px; margin: 0 auto; padding: 64px 28px 0;
    position: relative; z-index: 1;
  }

  /* ── GRID ── */
  .pv-footer .ft-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
    gap: 48px;
    padding-bottom: 56px;
    border-bottom: 1px solid rgba(245,237,216,0.07);
  }
  @media (max-width: 1024px) { .pv-footer .ft-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px)  { .pv-footer .ft-grid { grid-template-columns: 1fr; gap: 36px; } }

  /* ── BRAND ── */
  .pv-footer .ft-brand-row {
    display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
  }
  .pv-footer .ft-logo {
    width: 36px; height: 36px; border-radius: 10px;
    border: 1px solid rgba(212,168,83,0.2);
    object-fit: cover;
  }
  .pv-footer .ft-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-style: italic;
    color: var(--gold); margin: 0;
  }
  .pv-footer .ft-tagline {
    font-size: 13px; color: rgba(245,237,216,0.38);
    line-height: 1.75; margin: 0 0 22px;
    max-width: 240px;
  }

  /* Social icons */
  .pv-footer .ft-socials {
    display: flex; gap: 10px;
  }
  .pv-footer .ft-social-btn {
    width: 34px; height: 34px; border-radius: 10px;
    border: 1px solid rgba(245,237,216,0.1);
    background: rgba(245,237,216,0.04);
    display: flex; align-items: center; justify-content: center;
    color: rgba(245,237,216,0.35);
    transition: all 0.25s cubic-bezier(.22,1,.36,1);
    cursor: pointer; text-decoration: none;
  }
  .pv-footer .ft-social-btn:hover {
    border-color: var(--gold);
    background: rgba(212,168,83,0.1);
    color: var(--gold);
    transform: translateY(-2px);
  }

  /* ── COLUMN ── */
  .pv-footer .ft-col-title {
    font-size: 10px; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(245,237,216,0.25);
    margin: 0 0 18px;
  }
  .pv-footer .ft-col-title span {
    display: inline-block; padding-bottom: 8px;
    border-bottom: 1px solid rgba(212,168,83,0.2);
  }
  .pv-footer .ft-links {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column; gap: 12px;
  }
  .pv-footer .ft-link {
    font-size: 13px; color: rgba(245,237,216,0.42);
    text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px;
    transition: color 0.2s, gap 0.2s;
  }
  .pv-footer .ft-link::before {
    content: '';
    width: 0; height: 1px;
    background: var(--gold);
    transition: width 0.25s cubic-bezier(.22,1,.36,1);
    display: inline-block;
  }
  .pv-footer .ft-link:hover {
    color: var(--gold);
  }
  .pv-footer .ft-link:hover::before { width: 10px; }

  /* ── CONTACT ── */
  .pv-footer .ft-contact-list {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column; gap: 14px;
  }
  .pv-footer .ft-contact-item {
    display: flex; align-items: flex-start; gap: 11px;
  }
  .pv-footer .ft-contact-icon {
    width: 30px; height: 30px; flex-shrink: 0;
    border-radius: 9px;
    background: rgba(212,168,83,0.08);
    border: 1px solid rgba(212,168,83,0.15);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold); margin-top: 1px;
  }
  .pv-footer .ft-contact-text {
    font-size: 13px; color: rgba(245,237,216,0.42); line-height: 1.5;
  }

  /* ── BOTTOM BAR ── */
  .pv-footer .ft-bottom {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 14px;
    padding: 22px 0 28px;
    position: relative; z-index: 1;
  }
  .pv-footer .ft-copy {
    font-size: 12px; color: rgba(245,237,216,0.22); margin: 0;
  }
  .pv-footer .ft-legal {
    display: flex; gap: 20px;
  }
  .pv-footer .ft-legal-link {
    font-size: 12px; color: rgba(245,237,216,0.22);
    text-decoration: none; transition: color 0.2s;
  }
  .pv-footer .ft-legal-link:hover { color: var(--gold); }

  /* Gold badge accent */
  .pv-footer .ft-made-with {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px;
    background: rgba(212,168,83,0.07);
    border: 1px solid rgba(212,168,83,0.15);
    border-radius: 100px;
    font-size: 11px; color: rgba(212,168,83,0.6);
    letter-spacing: 0.04em;
  }
`;

/* ── Icons ── */
const MailIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const PhoneIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 .01h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
  </svg>
);
const PinIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const TwitterIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const LinkedInIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const StarIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="#D4A853" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function Footer() {
  return (
    <>
      <style>{styles}</style>
      <footer className="pv-footer">
        <div className="ft-top-rule" />
        <div className="ft-bg-glow" />

        <div className="ft-inner">
          <div className="ft-grid">
            {/* ── BRAND ── */}
            <div>
              <div className="ft-brand-row">
                <img src={logoImage} alt="Payivva logo" className="ft-logo" />
                <p className="ft-brand-name">Payivva</p>
              </div>
              <p className="ft-tagline">
                Your trusted multi-vendor marketplace. Shop from thousands of
                vendors with confidence.
              </p>
              <div className="ft-socials">
                <a href="#" className="ft-social-btn" aria-label="Twitter">
                  <TwitterIcon />
                </a>
                <a href="#" className="ft-social-btn" aria-label="Instagram">
                  <InstagramIcon />
                </a>
                <a href="#" className="ft-social-btn" aria-label="LinkedIn">
                  <LinkedInIcon />
                </a>
              </div>
            </div>

            {/* ── QUICK LINKS ── */}
            <div>
              <p className="ft-col-title">
                <span>Quick Links</span>
              </p>
              <ul className="ft-links">
                <li>
                  <Link to="/products" className="ft-link">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="ft-link">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="ft-link">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="ft-link">
                    Order Status
                  </Link>
                </li>
              </ul>
            </div>

            {/* ── FOR VENDORS ── */}
            <div>
              <p className="ft-col-title">
                <span>For Vendors</span>
              </p>
              <ul className="ft-links">
                <li>
                  <Link to="/register" className="ft-link">
                    Become a Vendor
                  </Link>
                </li>
                <li>
                  <Link to="/vendor/dashboard" className="ft-link">
                    Vendor Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* ── CONTACT ── */}
            <div>
              <p className="ft-col-title">
                <span>Contact Us</span>
              </p>
              <ul className="ft-contact-list">
                <li className="ft-contact-item">
                  <span className="ft-contact-icon">
                    <MailIcon />
                  </span>
                  <span className="ft-contact-text">support@payivva.com</span>
                </li>
                <li className="ft-contact-item">
                  <span className="ft-contact-icon">
                    <PhoneIcon />
                  </span>
                  <span className="ft-contact-text">+1 (555) 123-4567</span>
                </li>
                <li className="ft-contact-item">
                  <span className="ft-contact-icon">
                    <PinIcon />
                  </span>
                  <span className="ft-contact-text">
                    123 Commerce St, Tech City
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* ── BOTTOM BAR ── */}
          <div className="ft-bottom">
            <p className="ft-copy">
              &copy; {new Date().getFullYear()} Payivva Technologies. All rights
              reserved.
            </p>
            <span className="ft-made-with">
              <StarIcon /> Crafted with care
            </span>
            <nav className="ft-legal">
              <Link to="/about" className="ft-legal-link">
                Privacy
              </Link>
              <Link to="/about" className="ft-legal-link">
                Terms
              </Link>
              <Link to="/contact" className="ft-legal-link">
                Support
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
