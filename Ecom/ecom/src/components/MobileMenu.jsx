import { Link } from "react-router-dom";
import { HiX } from "react-icons/hi";

export default function MobileMenu({ isOpen, onClose, linkGroups }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] lg:hidden"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="absolute top-0 right-0 w-[80%] max-w-[320px] h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Menu
          </span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <span className="sr-only">Close menu</span>
            <HiX className="text-2xl" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {linkGroups.map((group, index) => (
            <div
              key={group.title}
              className={
                index > 0
                  ? "mt-6 pt-6 border-t border-gray-200 dark:border-gray-800"
                  : ""
              }
            >
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {group.title}
              </h4>
              <nav className="space-y-1">
                {group.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={link.onClick || onClose}
                    className={`block py-2.5 px-3 rounded-lg font-medium transition-colors ${link.className || "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
