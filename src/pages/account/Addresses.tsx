import BackButton from "@/components/ui/BackButton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Addresses = () => {
  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address_line: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  // ✅ Get user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // ✅ Fetch addresses
  const fetchAddresses = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setAddresses(data || []);
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  // ✅ Handle pincode auto-fill
  const handlePincodeChange = async (value: string) => {
    setForm({ ...form, pincode: value });

    if (value.length === 6) {
      setPincodeLoading(true);

      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${value}`
        );
        const data = await res.json();

        if (data[0].Status === "Success") {
          const post = data[0].PostOffice[0];

          setForm((prev) => ({
            ...prev,
            city: post.District || "",
            state: post.State || "",
          }));
        }
      } catch (err) {
        console.log("Pincode error");
      }

      setPincodeLoading(false);
    }
  };

  // ✅ Add / Update address
  const handleSave = async () => {
    if (!user) return;

    setLoading(true);

    if (editingId) {
      await supabase
        .from("addresses")
        .update(form)
        .eq("id", editingId);
    } else {
      await supabase.from("addresses").insert([
        {
          ...form,
          user_id: user.id,
        },
      ]);
    }

    setForm({
      name: "",
      phone: "",
      address_line: "",
      pincode: "",
      city: "",
      state: "",
    });

    setEditingId(null);
    fetchAddresses();
    setLoading(false);
  };

  // ✅ Delete
  const handleDelete = async (id: string) => {
    await supabase.from("addresses").delete().eq("id", id);
    fetchAddresses();
  };

  // ✅ Edit
  const handleEdit = (addr: any) => {
    setForm(addr);
    setEditingId(addr.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Set default
  const handleDefault = async (id: string) => {
    if (!user) return;

    // remove previous default
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);

    // set new default
    await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id);

    fetchAddresses();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <BackButton />
      <h1 className="text-2xl font-semibold mb-8">My Addresses</h1>

      {/* FORM */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4">
          {editingId ? "Edit Address" : "Add New Address"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Address"
            value={form.address_line}
            onChange={(e) =>
              setForm({ ...form, address_line: e.target.value })
            }
            className="border p-3 rounded-lg md:col-span-2"
          />

          <input
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => handlePincodeChange(e.target.value)}
            className="border p-3 rounded-lg"
            maxLength={6}
          />

          <input
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm({ ...form, city: e.target.value })
            }
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="State"
            value={form.state}
            onChange={(e) =>
              setForm({ ...form, state: e.target.value })
            }
            className="border p-3 rounded-lg md:col-span-2"
          />
        </div>

        {pincodeLoading && (
          <p className="text-sm text-gray-500 mt-2">
            Fetching city & state...
          </p>
        )}

        <button
          onClick={handleSave}
          className="mt-6 bg-black text-white px-6 py-2 rounded-lg hover:opacity-90"
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
      </div>

      {/* LIST */}
      <div className="mt-8 space-y-4">
        {addresses.length === 0 && (
          <p className="text-gray-500">No addresses yet.</p>
        )}

        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="border rounded-xl p-5 flex justify-between items-start shadow-sm hover:shadow-md transition"
          >
            <div className="flex gap-3">
              <input
                type="radio"
                checked={addr.is_default}
                onChange={() => handleDefault(addr.id)}
              />

              <div>
                <p className="font-medium">
                  {addr.name}{" "}
                  {addr.is_default && (
                    <span className="text-xs bg-black text-white px-2 py-1 rounded ml-2">
                      Default
                    </span>
                  )}
                </p>

                <p className="text-sm text-gray-600">
                  {addr.address_line}
                </p>

                <p className="text-sm text-gray-600">
                  {addr.city}, {addr.state} – {addr.pincode}
                </p>

                <p className="text-sm text-gray-600">
                  {addr.phone}
                </p>
              </div>
            </div>

            <div className="text-sm space-x-3">
              {!addr.is_default && (
                <button
                  onClick={() => handleDefault(addr.id)}
                  className="text-gray-600 hover:underline"
                >
                  Make Default
                </button>
              )}

              <button
                onClick={() => handleEdit(addr)}
                className="text-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(addr.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;