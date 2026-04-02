import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  total_amount: number;
  payment_type: string;
  payment_status: string | null;
  order_status: string | null;
  created_at: string;
  items?: OrderItem[];
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!ordersData) return;

    // Fetch order items for all orders
    const orderIds = ordersData.map((o) => o.id);
    const { data: itemsData } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);

    const ordersWithItems = ordersData.map((order) => ({
      ...order,
      items: itemsData?.filter((item) => item.order_id === order.id) || [],
    }));

    setOrders(ordersWithItems);
  };

  return (
    <div>
      <h2 className="text-2xl font-light text-foreground mb-8">Orders</h2>

      {orders.length === 0 ? (
        <p className="text-muted-foreground text-sm">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-border">
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{order.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-light text-foreground">₹{Number(order.total_amount).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 ${order.payment_type === 'COD' ? 'bg-muted' : 'bg-accent'} text-foreground`}>
                        {order.payment_type}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </button>

              {expandedOrder === order.id && (
                <div className="border-t border-border p-4 bg-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Address</p>
                      <p className="text-sm font-light">{order.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Payment Status</p>
                      <p className="text-sm font-light">{order.payment_status}</p>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Items</p>
                      <table className="w-full">
                        <thead>
                          <tr className="text-left border-b border-border">
                            <th className="pb-2 text-xs font-light text-muted-foreground">Product</th>
                            <th className="pb-2 text-xs font-light text-muted-foreground">Size</th>
                            <th className="pb-2 text-xs font-light text-muted-foreground">Color</th>
                            <th className="pb-2 text-xs font-light text-muted-foreground">Qty</th>
                            <th className="pb-2 text-xs font-light text-muted-foreground">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr key={item.id} className="border-b border-border last:border-0">
                              <td className="py-2 text-sm font-light">{item.product_name}</td>
                              <td className="py-2 text-sm font-light">{item.size}</td>
                              <td className="py-2 text-sm font-light">{item.color}</td>
                              <td className="py-2 text-sm font-light">{item.quantity}</td>
                              <td className="py-2 text-sm font-light">₹{Number(item.price).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
