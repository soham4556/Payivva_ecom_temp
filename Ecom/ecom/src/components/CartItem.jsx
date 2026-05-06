import { HiTrash, HiMinus, HiPlus } from "react-icons/hi";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/helpers";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const imageUrl = item.image?.startsWith("http") || item.image?.startsWith("data:")
    ? item.image
    : item.image
      ? `/media/${item.image}`
      : "/placeholder.svg";


  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
      <img
        src={imageUrl}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
        <p className="text-indigo-600 font-bold">{formatPrice(item.price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
          aria-label="Decrease quantity"
        >
          <HiMinus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
          aria-label="Increase quantity"
        >
          <HiPlus className="w-4 h-4" />
        </button>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900">
          {formatPrice(item.price * item.quantity)}
        </p>
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 hover:text-red-700 mt-1 cursor-pointer"
          aria-label="Remove item"
        >
          <HiTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
