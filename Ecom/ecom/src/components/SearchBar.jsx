import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiSearch, HiChevronDown } from "react-icons/hi";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() || category !== "All") {
      const params = new URLSearchParams();
      if (query.trim()) params.append("search", query.trim());
      if (category !== "All") params.append("category", category);
      navigate(`/products?${params.toString()}`);
      setQuery("");
    }
  };

  const categories = [
    "All",
    "Access Control System",
    "AMC Services",
    "Biometric Security System",
    "Boom Barrier",
    "CCTV System",
    "Commercial TV",
    "EPABX System",
    "Fire Alarm System",
    "Intercom Systems",
    "Solar Power System",
    "UPS",
    "Video Door Phone",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full flex items-center h-10 group bg-white rounded-md overflow-hidden ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-orange-500"
    >
      {/* Category Dropdown */}
      <div className="relative h-full border-r border-gray-200">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-full pl-2 pr-6 bg-gray-100 hover:bg-gray-200 text-[10px] sm:text-xs text-gray-700 cursor-pointer outline-none appearance-none w-[70px] sm:w-[60px] truncate"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <HiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs" />
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Payivva"
        className="flex-1 h-full px-3 text-sm text-gray-900 bg-white placeholder-gray-500 outline-none min-w-0"
      />

      {/* Search Button */}
      <button
        type="submit"
        className="h-full px-4 sm:px-5 bg-[#febd69] hover:bg-[#f3a847] text-[#333] transition-colors shrink-0"
      >
        <HiSearch className="text-lg sm:text-2xl" />
      </button>
    </form>
  );
}
