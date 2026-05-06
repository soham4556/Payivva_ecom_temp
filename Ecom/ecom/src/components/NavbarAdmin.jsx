import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiUser, HiLogout } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/logo.png";
import MobileMenu from "./MobileMenu";

export default function NavbarAdmin() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const menuLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/vendors", label: "Vendors" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/categories", label: "Categories" },
    { to: "/admin/payments", label: "Payments" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/reports", label: "Reports" },
  ];

  const mobileMenuGroups = [
    { title: "Admin Menu", links: menuLinks },
    {
      title: "Account",
      links: [
        { to: "/admin/settings", label: "Settings" },
        {
          label: "Logout",
          onClick: handleLogout,
          to: "#",
          className: "text-red-600 hover:bg-red-50",
        },
      ],
    },
  ];

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
      `}</style>
      <header
        className={`nav-font sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:bg-gray-900/90 dark:border-gray-800"
            : "bg-white border-b border-transparent dark:bg-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 relative">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-3 group"
              >
                <img src={logoImage} alt="Logo" className="h-12 w-auto" />
                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="text-xl font-bold logo-font shimmer-logo tracking-wide">
                    PAYIVVA
                  </span>
                  <span className="text-[11px] font-semibold tracking-[0.15em] text-gray-700 dark:text-gray-300">
                    TECHNOLOGIES
                  </span>
                  <span className="text-[8px] font-medium tracking-[0.18em] text-[#D4AF37] uppercase">
                    Inspiring Innovations
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Admin Panel Title */}
            <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-xl font-bold text-gray-800 dark:text-white uppercase tracking-[0.2em]">
                Admin Panel 😀
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user?.first_name || "Admin"}
              </span>
              <Link
                to="/admin/settings"
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <HiUser className="w-6 h-6" />
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
              >
                <HiLogout className="w-5 h-5" />
                Logout
              </button>
              
              {/* Menu button moved to right */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-700 dark:text-gray-200"
                aria-label="Open menu"
              >
                <HiMenu className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        linkGroups={mobileMenuGroups}
      />
    </>
  );
}
