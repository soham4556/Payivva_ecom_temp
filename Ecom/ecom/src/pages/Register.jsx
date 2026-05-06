import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/logo.png";
import SuccessModal from "../components/SuccessModal";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pv-register {
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
    min-height: 80vh;
    background: var(--surface);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 48px 24px;
  }

  .pv-register .rg-serif { font-family: 'Playfair Display', serif; }

  @keyframes rg-fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes rg-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes rg-spin { to { transform: rotate(360deg); } }

  .pv-register .rg-anim { animation: rg-fadeUp 0.5s ease both; }
  .pv-register .rg-a1 { animation-delay: 0.05s; }
  .pv-register .rg-a2 { animation-delay: 0.1s; }
  .pv-register .rg-a3 { animation-delay: 0.16s; }
  .pv-register .rg-a4 { animation-delay: 0.22s; }
  .pv-register .rg-a5 { animation-delay: 0.28s; }
  .pv-register .rg-a6 { animation-delay: 0.34s; }

  /* Card */
  .pv-register .register-card {
    width: 100%;
    max-width: 520px;
    background: #fff;
    border: 1px solid rgba(44,40,32,0.08);
    border-radius: 28px;
    padding: 44px 40px;
    box-shadow: 0 8px 48px rgba(0,0,0,0.07);
    position: relative;
    overflow: hidden;
  }
  .pv-register .register-card::before {
    content: '';
    position: absolute;
    top: 0; left: 40px; right: 40px;
    height: 3px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
    border-radius: 0 0 4px 4px;
  }

  /* Label */
  .pv-register .rg-label {
    display: block;
    font-size: 11px; font-weight: 700;
    color: var(--muted);
    letter-spacing: 0.09em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  /* Input */
  .pv-register .rg-input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid rgba(44,40,32,0.12);
    border-radius: 14px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--charcoal);
    background: #FDFBF7;
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    box-sizing: border-box;
  }
  .pv-register .rg-input::placeholder { color: #C4BAA8; }
  .pv-register .rg-input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212,168,83,0.15);
    background: #fff;
  }

  /* Password toggle */
  .pv-register .pw-wrap { position: relative; }
  .pv-register .pw-toggle {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--muted); display: flex; padding: 2px;
    transition: color 0.2s;
  }
  .pv-register .pw-toggle:hover { color: var(--charcoal); }

  /* Phone prefix */
  .pv-register .phone-wrap { position: relative; }
  .pv-register .phone-prefix {
    position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
    font-size: 13px; font-weight: 600; color: var(--muted);
    border-right: 1.5px solid rgba(44,40,32,0.12);
    padding-right: 12px; pointer-events: none;
  }

  /* Submit */
  .pv-register .btn-submit {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 15px 24px;
    background: var(--dark);
    color: var(--gold);
    border: none; border-radius: 16px;
    font-weight: 700; font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 6px 28px rgba(26,24,20,0.18);
    margin-top: 28px;
  }
  .pv-register .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(26,24,20,0.28);
  }
  .pv-register .btn-submit:disabled {
    background: #C4BAA8; color: #fff; cursor: not-allowed; box-shadow: none;
  }

  /* Spinner */
  .pv-register .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(212,168,83,0.3);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: rg-spin 0.7s linear infinite;
  }

  /* Error */
  .pv-register .error-box {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 12px 14px;
    background: rgba(192,57,43,0.06);
    border: 1px solid rgba(192,57,43,0.18);
    border-radius: 12px;
    margin-bottom: 20px;
    font-size: 13px; color: var(--danger); line-height: 1.5;
  }

  /* Divider */
  .pv-register .rg-divider {
    display: flex; align-items: center; gap: 12px; margin: 24px 0;
  }
  .pv-register .rg-divider::before,
  .pv-register .rg-divider::after {
    content: ''; flex: 1; height: 1px; background: rgba(44,40,32,0.08);
  }

  /* Section label */
  .pv-register .section-label {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 14px; margin-top: 4px;
  }

  /* Gold shimmer */
  .pv-register .gold-brand {
    background: linear-gradient(135deg, #D4A853 0%, #F0C97A 50%, #D4A853 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: rg-shimmer 3s linear infinite;
  }

  @media (max-width: 480px) {
    .pv-register .register-card { padding: 32px 20px; border-radius: 24px; }
    .pv-register .two-col { grid-template-columns: 1fr !important; }
  }
`;

const EyeIcon = ({ open }) =>
  open ? (
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
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
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

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
    width="16"
    height="16"
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

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      setShowSuccessModal(true);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const msg =
          typeof data === "string"
            ? data
            : Object.values(data).flat().join(" ");
        setError(msg);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <Helmet>
        <title>Create Account — Payivva</title>
      </Helmet>

      <div className="pv-register">
        <div className="register-card">
          {/* Logo */}
          <div
            className="rg-anim rg-a1"
            style={{ textAlign: "center", marginBottom: 28 }}
          >
            <img
              src={logoImage}
              alt="Payivva"
              style={{
                height: 48,
                width: "auto",
                objectFit: "contain",
                margin: "0 auto 10px",
                display: "block",
              }}
            />
            <p
              className="rg-serif gold-brand"
              style={{
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: "0.05em",
                margin: 0,
              }}
            >
              PAYIVVA
            </p>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "var(--muted)",
                textTransform: "uppercase",
                margin: "2px 0 0",
              }}
            >
              Technologies
            </p>
          </div>

          {/* Heading */}
          <div
            className="rg-anim rg-a2"
            style={{ textAlign: "center", marginBottom: 28 }}
          >
            <h1
              className="rg-serif"
              style={{
                fontSize: 24,
                color: "var(--charcoal)",
                margin: "0 0 6px",
              }}
            >
              Create <em>Account</em>
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
              Join Payivva and start shopping
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="error-box rg-anim rg-a1">
              <AlertIcon />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Personal info */}
            <p className="section-label rg-anim rg-a3">Personal Information</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Name row */}
              <div
                className="two-col rg-anim rg-a3"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label className="rg-label">First Name</label>
                  <input
                    type="text"
                    required
                    className="rg-input"
                    placeholder="Raj"
                    value={form.first_name}
                    onChange={update("first_name")}
                  />
                </div>
                <div>
                  <label className="rg-label">Last Name</label>
                  <input
                    type="text"
                    required
                    className="rg-input"
                    placeholder="Sharma"
                    value={form.last_name}
                    onChange={update("last_name")}
                  />
                </div>
              </div>

              {/* Username */}
              <div className="rg-anim rg-a3">
                <label className="rg-label">Username</label>
                <input
                  type="text"
                  required
                  className="rg-input"
                  placeholder="rajsharma99"
                  value={form.username}
                  onChange={update("username")}
                />
              </div>

              {/* Email */}
              <div className="rg-anim rg-a4">
                <label className="rg-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="rg-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update("email")}
                />
              </div>

              {/* Phone */}
              <div className="rg-anim rg-a4">
                <label className="rg-label">
                  Phone{" "}
                  <span
                    style={{
                      fontWeight: 400,
                      textTransform: "none",
                      letterSpacing: 0,
                      fontSize: 10,
                    }}
                  >
                    (optional)
                  </span>
                </label>
                <div className="phone-wrap">
                  <span className="phone-prefix">+91</span>
                  <input
                    type="tel"
                    className="rg-input"
                    style={{ paddingLeft: 64 }}
                    placeholder="98765 43210"
                    value={form.phone}
                    onChange={update("phone")}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="rg-divider rg-anim rg-a4">
                <span
                  style={{
                    fontSize: 10,
                    color: "var(--muted)",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  Set Password
                </span>
              </div>

              {/* Passwords */}
              <div
                className="two-col rg-anim rg-a5"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label className="rg-label">Password</label>
                  <div className="pw-wrap">
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      className="rg-input"
                      style={{ paddingRight: 44 }}
                      placeholder="Min 8 chars"
                      value={form.password}
                      onChange={update("password")}
                    />
                    <button
                      type="button"
                      className="pw-toggle"
                      onClick={() => setShowPw(!showPw)}
                    >
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="rg-label">Confirm</label>
                  <div className="pw-wrap">
                    <input
                      type={showPw2 ? "text" : "password"}
                      required
                      className="rg-input"
                      style={{ paddingRight: 44 }}
                      placeholder="Repeat password"
                      value={form.password2}
                      onChange={update("password2")}
                    />
                    <button
                      type="button"
                      className="pw-toggle"
                      onClick={() => setShowPw2(!showPw2)}
                    >
                      <EyeIcon open={showPw2} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Password match indicator */}
              {form.password && form.password2 && (
                <div
                  className="rg-anim rg-a1"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background:
                        form.password === form.password2
                          ? "#2ECC71"
                          : "#E74C3C",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      color:
                        form.password === form.password2
                          ? "#166534"
                          : "var(--danger)",
                      fontWeight: 600,
                    }}
                  >
                    {form.password === form.password2
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </span>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-submit rg-anim rg-a5"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" /> Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div
            className="rg-anim rg-a6"
            style={{ marginTop: 20, textAlign: "center" }}
          >
            <span style={{ fontSize: 13, color: "var(--muted)" }}>
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              style={{
                fontSize: 13,
                color: "var(--gold)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/login");
        }} 
      />
    </>
  );
}
