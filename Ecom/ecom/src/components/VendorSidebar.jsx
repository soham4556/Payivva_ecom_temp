import { NavLink } from "react-router-dom";
import { HiChartPie, HiShoppingBag, HiPlus, HiClipboardList } from "react-icons/hi";

export default function VendorSidebar() {
  const links = [
    { to: "/vendor/dashboard", label: "Overview", icon: HiChartPie, end: true },
    { to: "/vendor/products", label: "My Products", icon: HiShoppingBag },
    { to: "/vendor/products/new", label: "Add Product", icon: HiPlus },
    { to: "/vendor/orders", label: "Orders", icon: HiClipboardList },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden lg:block sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
      <nav className="p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}