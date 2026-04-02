import { Link, useNavigate, useLocation } from "react-router-dom";
import { Package, User, MapPin, Shield, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Account = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<any>(null);

  // ✅ NEW: profile name state
  const [profileName, setProfileName] = useState("");

  // ✅ AUTH LISTENER (your original)
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ✅ NEW: FETCH PROFILE NAME FROM DB
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userData.user.id)
        .single();

      setProfileName(
        data?.full_name || userData.user.email.split("@")[0]
      );
    };

    fetchProfile();
  }, []);

  // ❌ OLD (kept for fallback, not used directly)
  const username = user?.email?.split("@")[0] || "User";

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/account" },
    { name: "Orders", icon: Package, path: "/account/orders" },
    { name: "Profile", icon: User, path: "/account/profile" },
    { name: "Addresses", icon: MapPin, path: "/account/addresses" },
    { name: "Security", icon: Shield, path: "/account/security" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex gap-8">

      {/* SIDEBAR */}
      <div className="w-64 hidden lg:block">
        <div className="bg-white border rounded-xl p-6 shadow-sm">

          <h2 className="text-lg font-semibold mb-6">My Account</h2>

          <div className="space-y-2">
            {menu.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/");
            }}
            className="mt-6 w-full text-sm text-red-500 hover:text-red-700"
          >
            Logout
          </button>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-black mb-4"
          >
            ← Back to Home
          </button>

          <h2 className="text-sm text-gray-500">Welcome back 👋</h2>

          {/* ✅ UPDATED NAME (MAIN FIX) */}
          <h1 className="text-3xl font-semibold mt-1">
            {profileName || username}
          </h1>
        </div>

        {/* DASHBOARD CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <Link to="/account/orders" className="group bg-white border rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition">
            <Package className="mb-4" />
            <h3 className="font-medium">Your Orders</h3>
            <p className="text-sm text-gray-500 mt-1">Track & manage orders</p>
          </Link>

          <Link to="/account/profile" className="group bg-white border rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition">
            <User className="mb-4" />
            <h3 className="font-medium">Profile</h3>
            <p className="text-sm text-gray-500 mt-1">Edit personal details</p>
          </Link>

          <Link to="/account/addresses" className="group bg-white border rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition">
            <MapPin className="mb-4" />
            <h3 className="font-medium">Addresses</h3>
            <p className="text-sm text-gray-500 mt-1">Manage saved addresses</p>
          </Link>

        </div>

        {/* RECENT ORDERS */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

          <div className="bg-white border rounded-xl p-6 text-sm text-gray-500">
            No recent orders yet.
          </div>
        </div>

        {/* PROFILE SUMMARY */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-medium mb-2">Account Info</h3>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-medium mb-2">Security</h3>
            <p className="text-sm text-gray-600">Google Login Enabled</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Account;