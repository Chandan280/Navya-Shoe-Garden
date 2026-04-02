import BackButton from "@/components/ui/BackButton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Mail, Key, LogOut, Smartphone } from "lucide-react";

const Security = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    getUser();
  }, []);

  const isGoogle = user?.app_metadata?.provider === "google";

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    setProcessing(true);

    await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: window.location.origin,
    });

    alert("Password reset email sent!");
    setProcessing(false);
  };

  const handleLogoutAll = async () => {
    setProcessing(true);
    await supabase.auth.signOut();
    alert("Logged out from all devices");
    setProcessing(false);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading security settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <BackButton />

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold flex items-center gap-2">
            <Shield size={28} /> Security
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account security and login settings
          </p>
        </div>

        <div className="space-y-6">

          {/* LOGIN METHOD */}
          <div className="bg-white/80 backdrop-blur border rounded-2xl p-6 shadow-sm hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone size={18} />
              <h2 className="font-medium">Login Method</h2>
            </div>
            <p className="text-sm text-gray-600">
              {isGoogle ? "Google Authentication" : "Email & Password"}
            </p>
          </div>

          {/* EMAIL */}
          <div className="bg-white/80 backdrop-blur border rounded-2xl p-6 shadow-sm hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-2">
              <Mail size={18} />
              <h2 className="font-medium">Email Address</h2>
            </div>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>

          {/* PASSWORD */}
          {!isGoogle && (
            <div className="bg-white/80 backdrop-blur border rounded-2xl p-6 shadow-sm hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-2">
                <Key size={18} />
                <h2 className="font-medium">Password</h2>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Reset your password securely via email
              </p>

              <button
                onClick={handlePasswordReset}
                disabled={processing}
                className="px-5 py-2 bg-black text-white rounded-xl hover:scale-105 transition"
              >
                {processing ? "Sending..." : "Reset Password"}
              </button>
            </div>
          )}

          {/* ACTIVE SESSION */}
          <div className="bg-white/80 backdrop-blur border rounded-2xl p-6 shadow-sm hover:shadow-xl transition">
            <h2 className="font-medium mb-3">Active Session</h2>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Current Device</p>
                <p className="text-xs text-gray-500">
                  Browser session active now
                </p>
              </div>

              <span className="text-green-600 text-xs font-medium">
                Active
              </span>
            </div>
          </div>

          {/* LOGOUT ALL */}
          <div className="bg-white/80 backdrop-blur border rounded-2xl p-6 shadow-sm hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-2">
              <LogOut size={18} />
              <h2 className="font-medium">Logout Everywhere</h2>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Sign out from all devices for security
            </p>

            <button
              onClick={handleLogoutAll}
              disabled={processing}
              className="px-5 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition"
            >
              {processing ? "Processing..." : "Logout All Devices"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Security;