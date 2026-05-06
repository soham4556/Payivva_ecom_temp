import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiMenu,
  HiShoppingCart,
  HiChevronDown,
  HiUser,
  HiX,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SearchBar from "./SearchBar";
import logoImage from "../assets/logo.png";

export default function Navbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { state: { loggedOut: true } });
    setShowUserMenu(false);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

        .nav-font { font-family: 'Outfit', sans-serif; }
        .logo-font { font-family: 'Cinzel', serif; }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .shimmer-logo {
          background: linear-gradient(90deg, #D4AF37 0%, #FFF0A0 40%, #D4AF37 60%, #B8921E 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3.5s linear infinite;
        }

        .cursor-glow {
          pointer-events: none;
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: width 0.3s ease, height 0.3s ease;
          z-index: -1;
        }

        .header-border-active {
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .cart-count {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: #D4AF37;
            color: #fff;
            border-radius: 50%;
            height: 18px;
            width: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 700;
        }
        
        .mobile-sidebar {
            transition: transform 0.3s ease-in-out;
        }
      `}</style>

      <header
        onMouseMove={handleMouseMove}
        className={`nav-font fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "header-border-active py-2" : "py-4"
        }`}
        style={{
          background: scrolled ? "#FFFFFF" : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px) saturate(140%)",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.03)" : "none",
        }}
      >
        <div
          className="cursor-glow hidden lg:block"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            width: 340,
            height: 340,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-full">
            {/* Left: Hamburger (Mobile) & Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <HiMenu className="text-2xl" />
              </button>

              <Link to="/" className="flex items-center gap-3 group">
                <img
                  src={logoImage}
                  alt="Logo"
                  className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="text-xl font-bold logo-font shimmer-logo tracking-wide">
                    PAYIVVA
                  </span>
                  <span className="text-[11px] font-semibold tracking-[0.15em] text-gray-700">
                    TECHNOLOGIES
                  </span>
                  <span className="text-[8px] font-medium tracking-[0.18em] text-[#D4AF37] uppercase">
                    Inspiring Innovations
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Search Bar (Desktop) */}
            <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
              <div className="w-full max-w-sm">
                <SearchBar />
              </div>
              <nav className="flex items-center gap-4 lg:gap-6">
                <Link to="/" className="text-[13px] font-semibold text-white hover:text-[#D4AF37] transition-colors">Home</Link>
                <Link to="/products" className="text-[13px] font-semibold text-white hover:text-[#D4AF37] transition-colors">Products</Link>
                <Link to="/services" className="text-[13px] font-semibold text-white hover:text-[#D4AF37] transition-colors">Services</Link>
                <Link to="/solutions" className="text-[13px] font-semibold text-white hover:text-[#D4AF37] transition-colors">Solutions</Link>
                <Link to="/about" className="text-[13px] font-semibold text-white hover:text-[#D4AF37] transition-colors">About</Link>
                <Link to="/contact" className="text-[13px] font-semibold text-white hover:text-[#D4AF37] transition-colors">Contact</Link>
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6 shrink-0">
              {/* Account */}
              <div
                className="relative hidden md:block group"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <button className="flex items-center gap-2 py-2 text-gray-700 hover:text-[#D4AF37] transition-colors cursor-pointer">
                  <div className="text-right">
                    <div className="text-[11px] text-gray-500 font-medium tracking-wide">
                      {isAuthenticated
                        ? `Hello, ${user?.first_name || "User"}`
                        : "Welcome"}
                    </div>
                    <div className="text-sm font-bold flex items-center justify-end gap-1">
                      Account <HiChevronDown />
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-[#D4AF37] transition-colors">
                    <HiUser className="text-xl" />
                  </div>
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full pt-2 w-64 origin-top-right">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 overflow-hidden">
                      {!isAuthenticated ? (
                        <div className="text-center space-y-3">
                          <Link
                            to="/login"
                            className="block w-full bg-gradient-to-r from-[#D4AF37] to-[#B8921E] text-white py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all text-sm"
                          >
                            Sign In
                          </Link>
                          <div className="text-xs text-gray-500">
                            New here?{" "}
                            <Link
                              to="/register"
                              className="text-[#D4AF37] font-semibold hover:underline"
                            >
                              Create account
                            </Link>
                          </div>
                        </div>
                      ) : (
                          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            My Account
                          </div>
                          {user?.role === "vendor" ? (
                            <Link
                              to="/vendor/dashboard"
                              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] rounded-lg transition-colors font-bold"
                            >
                              Vendor Dashboard
                            </Link>
                          ) : user?.role === "admin" ? (
                            <Link
                              to="/admin/dashboard"
                              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] rounded-lg transition-colors font-bold"
                            >
                              Admin Dashboard
                            </Link>
                          ) : (
                            <Link
                              to="/profile"
                              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] rounded-lg transition-colors"
                            >
                              Profile
                            </Link>
                          )}
                          <Link
                            to={user?.role === "vendor" ? "/vendor/dashboard/orders" : "/orders"}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] rounded-lg transition-colors"
                          >
                            Orders
                          </Link>
                          <div className="h-px bg-gray-100 my-2"></div>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium cursor-pointer"
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-700 hover:text-[#D4AF37] transition-colors group"
              >
                <HiShoppingCart className="text-2xl group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="cart-count">{totalItems}</span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4 pb-2">
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[120px] lg:h-[88px]"></div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute top-0 right-0 w-[80%] max-w-[300px] h-full bg-white shadow-2xl mobile-sidebar transform transition-transform duration-300 ease-in-out">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <span className="text-xl font-bold logo-font text-gray-900">
                PAYIVVA
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <HiX className="text-2xl" />
              </button>
            </div>
            <div className="p-5">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Menu
                  </h4>
                  <div className="space-y-2">
                    <Link
                      to="/"
                      onClick={() => setIsSidebarOpen(false)}
                      className="block py-2 text-gray-700 font-medium"
                    >
                      Home
                    </Link>
                    <Link
                      to="/products"
                      onClick={() => setIsSidebarOpen(false)}
                      className="block py-2 text-gray-700 font-medium"
                    >
                      Products
                    </Link>
                    <Link
                      to="/about"
                      onClick={() => setIsSidebarOpen(false)}
                      className="block py-2 text-gray-700 font-medium"
                    >
                      About
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setIsSidebarOpen(false)}
                      className="block py-2 text-gray-700 font-medium"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Account
                  </h4>
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      {user?.role === "vendor" ? (
                        <Link
                          to="/vendor/dashboard"
                          onClick={() => setIsSidebarOpen(false)}
                          className="block py-2 text-[#D4AF37] font-bold"
                        >
                          Vendor Dashboard
                        </Link>
                      ) : user?.role === "admin" ? (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsSidebarOpen(false)}
                          className="block py-2 text-[#D4AF37] font-bold"
                        >
                          Admin Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/profile"
                          onClick={() => setIsSidebarOpen(false)}
                          className="block py-2 text-gray-700 font-medium"
                        >
                          Profile
                        </Link>
                      )}
                      <Link
                        to={user?.role === "vendor" ? "/vendor/dashboard/orders" : "/orders"}
                        onClick={() => setIsSidebarOpen(false)}
                        className="block py-2 text-gray-700 font-medium"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left py-2 text-red-600 font-medium cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsSidebarOpen(false)}
                      className="block py-2 text-[#D4AF37] font-bold"
                    >
                      Sign In / Register
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
