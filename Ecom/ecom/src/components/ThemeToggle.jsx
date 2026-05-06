import { HiMoon, HiSun } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors duration-200 ${
        theme === "dark"
          ? "text-yellow-400 hover:bg-gray-800"
          : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-700"
      } ${className || ""}`}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <HiSun className="w-6 h-6" />
      ) : (
        <HiMoon className="w-6 h-6" />
      )}
    </button>
  );
}
