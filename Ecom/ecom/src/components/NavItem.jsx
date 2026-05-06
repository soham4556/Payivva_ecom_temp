import { NavLink } from "react-router-dom";

export default function NavItem({ to, children, className, ...props }) {
  const navLinkClasses =
    "px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200";

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${navLinkClasses} ${isActive ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300" : ""} ${className || ""}`
      }
      {...props}
    >
      {children}
    </NavLink>
  );
}
