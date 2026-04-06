import { useEffect, useState } from "react"; import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        .limit(5);
      if (!orders) return;

      setRecentOrders(orders);

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
      const codOrders = orders.filter((o) => o.payment_type === "COD");
      const onlineOrders = orders.filter((o) => o.payment_type === "Online");

      setStats({
        totalOrders,
        totalRevenue,
        codRevenue: codOrders.reduce((sum, o) => sum + Number(o.total_amount), 0),
        onlineRevenue: onlineOrders.reduce((sum, o) => sum + Number(o.total_amount), 0),
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

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card
            key={card.title}
            className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
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
        <h3 className="text-lg font-medium mb-4">Recent Orders</h3>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-500">No recent orders</p>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => {
                  setSelectedOrder(order);
                  fetchOrderItems(order.id);
                }}
                className="flex justify-between items-center border-b pb-3 last:border-0 cursor-pointer hover:bg-gray-50 px-2 rounded-lg transition"
              >
                <div>
                  <p className="text-sm font-medium">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.city}, {order.state}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold">
                    ₹{Number(order.total_amount).toLocaleString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(
                      order.status || order.payment_status
                    )}`}
                  >
                    {order.status || order.payment_status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    {selectedOrder && (
      <Dialog open={true} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
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
                    <div key={item.id} className="flex items-center gap-3 border p-2 rounded-lg">

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
