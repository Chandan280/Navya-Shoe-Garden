import BackButton from "@/components/ui/BackButton";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Orders = () => {
  const { addItem } = useCart(); // ✅ ADDED

  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setLoading(false);
      return;
    }

    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    const { data: itemsData } = await supabase
      .from("order_items")
      .select("*");

    if (ordersData) setOrders(ordersData);
    if (itemsData) setOrderItems(itemsData);

    setLoading(false);
  };

  const getItems = (orderId: string) =>
    orderItems.filter((item) => item.order_id === orderId);

  const toggleOrder = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const cancelOrder = async (orderId: string) => {
    await supabase
      .from("orders")
      .update({ payment_status: "cancelled" })
      .eq("id", orderId);

    fetchOrders();
  };

  // ✅ NEW: REORDER FUNCTION
  const handleReorder = (items: any[]) => {
    items.forEach((item) => {
      addItem({
        id: Date.now() + Math.random(),
        productId: item.product_id,
        name: item.product_name,
        price: item.price / item.quantity,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image,
      });
    });
  };

  const getStatusStyle = (status: string) => {
    if (status === "paid")
      return "bg-green-100 text-green-700 border-green-200";
    if (status === "pending")
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (status === "cancelled")
      return "bg-red-100 text-red-600 border-red-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  const getTimeline = (status: string) => {
    const steps = ["placed", "confirmed", "shipped", "delivered"];
    const currentIndex =
      status === "pending"
        ? 0
        : status === "paid"
        ? 1
        : status === "delivered"
        ? 3
        : -1;

    return steps.map((step, i) => ({
      step,
      done: i <= currentIndex,
    }));
  };

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton />
      <h1 className="text-3xl font-semibold mb-8">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
          <p className="text-lg text-gray-500">No orders yet 🛍️</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const items = getItems(order.id);
            const isOpen = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className="bg-white border rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* HEADER */}
                <div
                  className="p-6 flex flex-col sm:flex-row justify-between gap-4 cursor-pointer"
                  onClick={() => toggleOrder(order.id)}
                >
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-semibold text-lg">
                      #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="font-semibold text-lg">
                        ₹{order.total_amount?.toLocaleString()}
                      </p>
                    </div>

                    <div
                      className={`text-xs px-3 py-1 border rounded-full ${getStatusStyle(
                        order.payment_status
                      )}`}
                    >
                      {order.payment_status}
                    </div>
                  </div>
                </div>

                {/* EXPANDED */}
                {isOpen && (
                  <div className="border-t px-6 pb-6 pt-5 space-y-6">

                    {/* TIMELINE */}
                    <div className="flex justify-between text-xs text-gray-500">
                      {getTimeline(order.payment_status).map((t, i) => (
                        <div key={i} className="flex flex-col items-center flex-1">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              t.done ? "bg-black" : "bg-gray-300"
                            }`}
                          />
                          <p className="mt-2 capitalize">{t.step}</p>
                        </div>
                      ))}
                    </div>

                    {/* ITEMS */}
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl"
                        >
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>

                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {item.product_name}
                            </p>

                            <p className="text-xs text-gray-500">
                              Size: {item.size} • {item.color}
                            </p>

                            <p className="text-xs text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          </div>

                          <div className="text-sm font-semibold">
                            ₹{item.price}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => handleReorder(items)} // ✅ CONNECTED
                        className="px-4 py-2 text-sm border rounded-lg hover:bg-black hover:text-white transition"
                      >
                        Reorder
                      </button>

                      {order.payment_status !== "cancelled" && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="px-4 py-2 text-sm border rounded-lg hover:bg-red-500 hover:text-white transition"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;