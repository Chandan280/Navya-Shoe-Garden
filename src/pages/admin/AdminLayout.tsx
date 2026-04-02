import { useEffect, useState } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingCart, BarChart3, LogOut } from "lucide-react";

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // ❌ Not logged in → go to login
        if (!session) {
          navigate("/admin/login");
          return;
        }

        // ✅ Logged in → allow access
        setIsAdmin(true);
      } catch (err) {
        console.error("ADMIN CHECK ERROR:", err);
        navigate("/admin/login");
      } finally {
        setLoading(false); // ✅ always stop loading
      }
    };

    checkAdmin();

    // ✅ Listen for logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  // 🔄 Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Loading admin panel...</p>
      </div>
    );
  }

  // ❌ Not allowed
  if (!isAdmin) return null;

  const navLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col bg-background">
        <div className="p-6 border-b border-border">
          <h1 className="text-sm font-semibold tracking-wide">
            NAVYA SHOE GARDEN
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all ${
                  isActive
                    ? "bg-black text-white"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm w-full rounded-md hover:bg-muted transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;