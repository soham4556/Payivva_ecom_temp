import { lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";

// Import the new navbar components
import NavbarCustomer from "./components/NavbarCustomer";
import NavbarVendor from "./components/NavbarVendor";
import NavbarAdmin from "./components/NavbarAdmin";

// Lazy load pages for code splitting
// The old Navbar is no longer imported
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const VendorDashboard = lazy(() => import("./pages/VendorDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PaymentGateway = lazy(() => import("./pages/PaymentGateway"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AppNavbar() {
  const location = useLocation();
  const { isAuthenticated, isAdmin, isVendor } = useAuth();

  if (location.pathname.startsWith("/admin")) {
    return isAuthenticated && isAdmin ? <NavbarAdmin /> : <NavbarCustomer />;
  }

  if (location.pathname.startsWith("/vendor")) {
    return isAuthenticated && isVendor ? <NavbarVendor /> : <NavbarCustomer />;
  }

  return <NavbarCustomer />;
}

export default function App() {
  const { isAuthenticated, user, isAdmin, isVendor } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* This now conditionally renders the correct navbar.
           Note: AppNavbar must be inside a Router context, which it is because App is wrapped in BrowserRouter in main.jsx */}

      <AppNavbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/payment" element={<PaymentGateway />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/orders" element={<OrderTracking />} />
            <Route path="/vendor/dashboard/*" element={<VendorDashboard />} />
            <Route path="/vendor/*" element={<VendorDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
