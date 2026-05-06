import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiUser } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/logo.png";
import MobileMenu from "./MobileMenu";

export default function NavbarVendor() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const menuLinks = [
    { to: "/vendor/dashboard", label: "Dashboard" },
    { to: "/vendor/products", label: "My Products" },
    { to: "/vendor/products/new", label: "Add Product" },
    { to: "/vendor/orders", label: "Orders" },
    { to: "/vendor/analytics", label: "Analytics" },
    { to: "/vendor/payments", label: "Payments" },
  ];

  const mobileMenuGroups = [
    { title: "Vendor Menu", links: menuLinks },
    {
      title: "Account",
      links: [
        { to: "/vendor/profile", label: "Profile" },
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
      <header className="nav-font sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 relative">
            <div className="flex items-center gap-4">
              <Link
                to="/vendor/dashboard"
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

            {/* Center: Vendor Panel Title */}
            <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-xl font-bold text-gray-800 dark:text-white uppercase tracking-[0.2em]">
                Vendor Panel
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">
                Hello, {user?.first_name || "Vendor"}
              </span>
              <Link
                to="/vendor/profile"
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600"
              >
                <HiUser className="w-6 h-6" />
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:block px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg"
              >
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
