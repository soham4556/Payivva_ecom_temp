import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/logo.png";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pv-login {
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
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
  }

  .pv-login .ln-serif { font-family: 'Playfair Display', serif; }

  @keyframes ln-fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ln-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes ln-spin { to { transform: rotate(360deg); } }

  .pv-login .ln-anim  { animation: ln-fadeUp 0.5s ease both; }
  .pv-login .ln-a1 { animation-delay: 0.05s; }
  .pv-login .ln-a2 { animation-delay: 0.12s; }
  .pv-login .ln-a3 { animation-delay: 0.2s; }
  .pv-login .ln-a4 { animation-delay: 0.28s; }
  .pv-login .ln-a5 { animation-delay: 0.36s; }

  /* Card */
  .pv-login .login-card {
    width: 100%;
    max-width: 440px;
    background: #fff;
    border: 1px solid rgba(44,40,32,0.08);
    border-radius: 28px;
    padding: 44px 40px;
    box-shadow: 0 8px 48px rgba(0,0,0,0.07);
    position: relative;
    overflow: hidden;
  }

  /* Top gold line accent */
  .pv-login .login-card::before {
    content: '';
    position: absolute;
    top: 0; left: 40px; right: 40px;
    height: 3px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
    border-radius: 0 0 4px 4px;
  }

  /* Label */
  .pv-login .ln-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: var(--muted);
    letter-spacing: 0.09em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  /* Input */
  .pv-login .ln-input {
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
  .pv-login .ln-input::placeholder { color: #C4BAA8; }
  .pv-login .ln-input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212,168,83,0.15);
    background: #fff;
  }

  /* Submit button */
  .pv-login .btn-submit {
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
  .pv-login .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(26,24,20,0.28);
  }
  .pv-login .btn-submit:disabled {
    background: #C4BAA8; color: #fff; cursor: not-allowed; box-shadow: none;
  }

  /* Spinner */
  .pv-login .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(212,168,83,0.3);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: ln-spin 0.7s linear infinite;
  }

  /* Divider */
  .pv-login .ln-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 24px 0;
  }
  .pv-login .ln-divider::before,
  .pv-login .ln-divider::after {
    content: ''; flex: 1;
    height: 1px; background: rgba(44,40,32,0.08);
  }

  /* Error box */
  .pv-login .error-box {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 12px 14px;
    background: rgba(192,57,43,0.06);
    border: 1px solid rgba(192,57,43,0.18);
    border-radius: 12px;
    margin-bottom: 20px;
    font-size: 13px;
    color: var(--danger);
    line-height: 1.5;
  }

  /* Success card */
  .pv-login .success-card {
    background: rgba(46,204,113,0.06);
    border: 1px solid rgba(46,204,113,0.2);
    border-radius: 18px;
    padding: 24px;
    text-align: center;
    margin-bottom: 28px;
  }

  /* Gold shimmer text */
  .pv-login .gold-brand {
    background: linear-gradient(135deg, #D4A853 0%, #F0C97A 50%, #D4A853 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ln-shimmer 3s linear infinite;
  }

  /* Password toggle */
  .pv-login .pw-wrap { position: relative; }
  .pv-login .pw-toggle {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--muted); display: flex; padding: 2px;
    transition: color 0.2s;
  }
  .pv-login .pw-toggle:hover { color: var(--charcoal); }

  @media (max-width: 480px) {
    .pv-login .login-card { padding: 32px 24px; border-radius: 24px; }
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

const CheckIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  /* ── LOGGED OUT STATE ── */
  if (location.state?.loggedOut) {
    return (
      <>
        <style>{styles}</style>
        <Helmet>
          <title>Logged Out — Payivva</title>
        </Helmet>
        <div className="pv-login">
          <div className="login-card" style={{ textAlign: "center" }}>
            {/* Logo */}
            <div className="ln-anim ln-a1" style={{ marginBottom: 28 }}>
              <img
                src={logoImage}
                alt="Payivva"
                style={{
                  height: 56,
                  width: "auto",
                  objectFit: "contain",
                  margin: "0 auto 10px",
                  display: "block",
                }}
              />
              <p
                className="ln-serif gold-brand"
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

            {/* Success */}
            <div className="success-card ln-anim ln-a2">
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "rgba(46,204,113,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                  color: "#2ECC71",
                }}
              >
                <CheckIcon />
              </div>
              <h2
                className="ln-serif"
                style={{
                  fontSize: 18,
                  color: "var(--charcoal)",
                  marginBottom: 6,
                }}
              >
                Successfully <em>logged out</em>
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Thank you for shopping with Payivva.
                <br />
                See you again soon!
              </p>
            </div>

            <div
              className="ln-anim ln-a3"
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <button
                className="btn-submit"
                style={{ marginTop: 0 }}
                onClick={() => navigate("/login", { replace: true, state: {} })}
              >
                Sign In Again <ArrowRight />
              </button>
              <Link
                to="/"
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  textAlign: "center",
                  textDecoration: "none",
                  padding: "8px 0",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--charcoal)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--muted)")
                }
              >
                ← Return to Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── SUBMIT ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const role = user.role?.toLowerCase();
      if (role === "vendor") navigate("/vendor/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  /* ── LOGIN FORM ── */
  return (
    <>
      <style>{styles}</style>
      <Helmet>
        <title>Login — Payivva</title>
      </Helmet>

      <div className="pv-login">
        <div className="login-card">
          {/* Logo + Title */}
          <div
            className="ln-anim ln-a1"
            style={{ textAlign: "center", marginBottom: 32 }}
          >
            <img
              src={logoImage}
              alt="Payivva"
              style={{
                height: 52,
                width: "auto",
                objectFit: "contain",
                margin: "0 auto 12px",
                display: "block",
              }}
            />
            <p
              className="ln-serif gold-brand"
              style={{
                fontSize: 22,
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
          <div className="ln-anim ln-a2" style={{ marginBottom: 28 }}>
            <h1
              className="ln-serif"
              style={{
                fontSize: 24,
                color: "var(--charcoal)",
                margin: "0 0 6px",
                textAlign: "center",
              }}
            >
              Welcome <em>Back</em>
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "var(--muted)",
                textAlign: "center",
                margin: 0,
              }}
            >
              Sign in to your Payivva account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="error-box ln-anim ln-a1">
              <AlertIcon />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Email */}
              <div className="ln-anim ln-a3">
                <label className="ln-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="ln-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              {/* Password */}
              <div className="ln-anim ln-a4">
                <label className="ln-label">Password</label>
                <div className="pw-wrap">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    className="ln-input"
                    style={{ paddingRight: 44 }}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-submit ln-anim ln-a4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" /> Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="ln-divider ln-anim ln-a5">
            <span
              style={{
                fontSize: 11,
                color: "var(--muted)",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              New to Payivva?
            </span>
          </div>

          {/* Register link */}
          <div className="ln-anim ln-a5">
            <Link
              to="/register"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                padding: "13px 24px",
                background: "transparent",
                border: "1.5px solid rgba(44,40,32,0.12)",
                borderRadius: 16,
                color: "var(--charcoal)",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                transition: "all 0.25s",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--gold)";
                e.currentTarget.style.color = "var(--dark)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(44,40,32,0.12)";
                e.currentTarget.style.color = "var(--charcoal)";
              }}
            >
              Create an Account
            </Link>
          </div>

          {/* Vendor note */}
          <p
            className="ln-anim ln-a5"
            style={{
              fontSize: 11,
              color: "var(--muted)",
              textAlign: "center",
              marginTop: 20,
              lineHeight: 1.6,
            }}
          >
            {" "}
            <Link
              to="/register"
              style={{
                color: "var(--gold)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            ></Link>
          </p>
        </div>
      </div>
    </>
  );
}
