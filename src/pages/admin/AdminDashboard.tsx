import { useEffect, useState } from "react";
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
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    codRevenue: 0,
    onlineRevenue: 0,
    codOrders: 0,
    onlineOrders: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: orders } = await supabase.from("orders").select("*");
      if (!orders) return;

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
  }, []);

  const statCards = [
    { title: "Total Orders", value: stats.totalOrders },
    { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}` },
    { title: "COD Orders", value: `${stats.codOrders} (₹${stats.codRevenue.toLocaleString()})` },
    { title: "Online Orders", value: `${stats.onlineOrders} (₹${stats.onlineRevenue.toLocaleString()})` },
  ];

  return (
    <div>
      <h2 className="text-2xl font-light text-foreground mb-8">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Card key={card.title} className="rounded-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-light text-muted-foreground">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-light text-foreground">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
