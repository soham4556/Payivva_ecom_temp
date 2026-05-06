import { formatPrice } from "../utils/helpers";

export default function DashboardStats({ stats }) {
  const cards = [
    { label: "Total Orders", value: stats.total_orders, color: "bg-blue-500" },
    {
      label: "Total Revenue",
      value: formatPrice(stats.total_revenue || 0),
      color: "bg-green-500",
    },
    {
      label: "Total Products",
      value: stats.total_products,
      color: "bg-purple-500",
    },
    {
      label: "Pending Orders",
      value: stats.pending_orders ?? stats.pending_vendors ?? 0,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl shadow-sm p-6">
          <div
            className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}
          >
            <span className="text-white text-xl font-bold">
              {typeof card.value === "number" ? card.value : "$"}
            </span>
          </div>
          <p className="text-gray-500 text-sm">{card.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
