import { useEffect, useState } from "react"; import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  codRevenue: number;
  onlineRevenue: number;
  codOrders: number;
  onlineOrders: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    codRevenue: 0,
    onlineRevenue: 0,
    codOrders: 0,
    onlineOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const filteredOrders = recentOrders.filter((o) =>
    (o.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.id || "").toLowerCase().includes(search.toLowerCase())
  );
  const fetchOrderItems = async (orderId: string) => {
    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (data) setSelectedItems(data);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        navigate("/");
        return;
      }

      // 🔥 CHANGE THIS EMAIL TO YOUR ADMIN EMAIL
      if (data.user.email !== "navyashoegarden6@gmail.com") {
        navigate("/");
        return;
      }
    };

    checkAdmin();

    const fetchStats = async () => {
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5) as { data: any[] };
      if (!orders) return;

      setRecentOrders(orders);

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0);
      const codOrders = orders.filter((o: any) => o.payment_type === "COD");
      const onlineOrders = orders.filter((o: any) => o.payment_type === "Online");

      setStats({
        totalOrders,
        totalRevenue,
        codRevenue: codOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0),
        onlineRevenue: onlineOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0),
        codOrders: codOrders.length,
        onlineOrders: onlineOrders.length,
      });
    };

    fetchStats();
  }, [navigate]);

  const statCards = [
    { title: "Total Orders", value: stats.totalOrders },
    { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}` },
    { title: "COD Orders", value: `${stats.codOrders} (₹${stats.codRevenue.toLocaleString()})` },
    { title: "Online Orders", value: `${stats.onlineOrders} (₹${stats.onlineRevenue.toLocaleString()})` },
  ];

  // Helper function to get status style
  const getStatusStyle = (status: string | null) => {
    const s = (status || "").toLowerCase();

    if (s === "paid" || s === "completed" || s === "delivered") {
      return "bg-green-100 text-green-700";
    }

    if (s === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (s === "failed" || s === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  const chartData = recentOrders.map((o, index) => ({
    name: `#${index + 1}`,
    revenue: Number(o.total_amount),
  }));

  const updateStatus = async (id: string, status: string) => {
    const db = supabase as any;
    // 1. Update order status
    await db
      .from("orders")
      .update({ status })
      .eq("id", id);

    // 2. If delivered → reduce stock
    if (status === "delivered") {
      const { data: items } = await db
        .from("order_items")
        .select("product_id, size, quantity")
        .eq("order_id", id);

      if (items) {
        for (const item of items) {
          const { data } = await db
            .from("product_sizes")
            .select("stock")
            .eq("product_id", item.product_id)
            .eq("size", item.size)
            .single();

          if (!data) continue;

          const newStock = Math.max(0, data.stock - item.quantity);

          await db
            .from("product_sizes")
            .update({ stock: newStock })
            .eq("product_id", item.product_id)
            .eq("size", item.size);
        }
      }
    }

    // 3. refresh UI (UNCHANGED)
    setRecentOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  return (
    <div className="p-8 space-y-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg font-medium mb-4">Revenue Trend</h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#000" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card
            key={card.title}
            className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-wide text-gray-500">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-gray-900">
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Orders</h3>

          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm w-60 focus:ring-2 focus:ring-black outline-none transition"
          />
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Order ID</th>
                  <th>Customer</th>
                  <th>City</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      fetchOrderItems(order.id);
                    }}
                    className="border-b cursor-pointer hover:bg-gray-50 transition"
                  >
                    <td className="py-3">#{order.id.slice(0, 6)}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.city}</td>
                    <td>₹{Number(order.total_amount).toLocaleString()}</td>
                    <td>
                      <select
                        value={order.status || "pending"}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-xs border rounded px-2 py-1 focus:ring-2 focus:ring-black outline-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    {selectedOrder && (
      <Dialog open={true} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">
            Order Details
          </h2>

          <div className="space-y-4 text-sm">

            <div className="space-y-1">
              <p><b>Name:</b> {selectedOrder.customer_name}</p>
              <p><b>Phone:</b> {selectedOrder.phone}</p>
              <p><b>Address:</b> {selectedOrder.address}</p>
              <p><b>City:</b> {selectedOrder.city}</p>
              <p><b>Total:</b> ₹{selectedOrder.total_amount}</p>
              <p><b>Status:</b> {selectedOrder.status}</p>
            </div>

            {/* 🔥 ORDER ITEMS */}
            <div>
              <h3 className="font-medium mt-4 mb-2">Items</h3>

              {selectedItems.length === 0 ? (
                <p className="text-gray-500 text-xs">No items found</p>
              ) : (
                <div className="space-y-3">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 border p-2 rounded-lg hover:shadow-md transition">

                      <img
                        src={item.image}
                        className="w-12 h-12 object-cover rounded-md"
                      />

                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} | Size: {item.size}
                        </p>
                      </div>

                      <p className="text-sm font-semibold">
                        ₹{item.price}
                      </p>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </DialogContent>
      </Dialog>
    )}
    </div>
  );
};

export default AdminDashboard;
