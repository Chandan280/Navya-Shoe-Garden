import BackButton from "@/components/ui/BackButton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    setUser(userData.user);

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();

    setForm({
      full_name: data?.full_name || "",
      phone: data?.phone || "",
      email: userData.user.email || "",
    });

    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name,
      phone: form.phone,
    });

    await getProfile(); // 🔥 IMPORTANT FIX

    setSaving(false);
    setSaved(true);

    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <BackButton />

      <h1 className="text-3xl font-semibold mb-8">Profile Settings</h1>

      <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl space-y-6 transition-all">

        {/* NAME */}
        <div>
          <label className="text-sm text-gray-500">Full Name</label>
          <input
            value={form.full_name}
            onChange={(e) =>
              setForm({ ...form, full_name: e.target.value })
            }
            className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm text-gray-500">Phone</label>
          <input
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <input
            value={form.email}
            disabled
            className="w-full border border-gray-100 rounded-xl px-4 py-3 mt-2 bg-gray-100"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSave}
          className="w-full bg-black text-white py-3 rounded-xl hover:scale-[1.02] hover:shadow-lg transition-all"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {/* SUCCESS */}
        {saved && (
          <div className="flex items-center gap-2 text-green-600 animate-fade-in">
            <CheckCircle size={18} />
            Saved successfully
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;