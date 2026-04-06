import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
const Product = () => {
  const { addItem } = useCart();
  const [products, setProducts] = useState<any[]>([]);

  // FILTER STATES
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // SORT STATE
  const [sortOption, setSortOption] = useState("featured");

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*");
      if (data) setProducts(data);
    };

    fetchProducts();
  }, []);

  // FILTER LOGIC
  const filteredProducts = products.filter((product) => {
    const matchesPrice =
      selectedPrices.length === 0 ||
      selectedPrices.some((price) => {
        if (price === "under1500") return product.mrp < 1500;
        if (price === "1500-3000") return product.mrp >= 1500 && product.mrp <= 3000;
        if (price === "3000-6000") return product.mrp >= 3000 && product.mrp <= 6000;
        if (price === "6000+") return product.mrp > 6000;
      });

    const matchesSize =
      selectedSizes.length === 0 ||
      product.sizes?.some((size: string) => selectedSizes.includes(size));

    return matchesPrice && matchesSize;
  });

  // SORT LOGIC
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "low-high") return a.mrp - b.mrp;
    if (sortOption === "high-low") return b.mrp - a.mrp;
    if (sortOption === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortOption === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="px-6 md:px-10 py-8 bg-white min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
          All Products
        </h1>

        {/* SORT */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="text-sm border px-3 py-2 rounded-md outline-none"
        >
          <option value="featured">Featured</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* FILTER SECTION */}
      <div className="mb-10 space-y-6">

        {/* PRICE */}
        <div>
          <h3 className="text-sm font-medium mb-3">Price</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Under ₹1500", value: "under1500" },
              { label: "₹1500 – ₹3000", value: "1500-3000" },
              { label: "₹3000 – ₹6000", value: "3000-6000" },
              { label: "₹6000+", value: "6000+" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setSelectedPrices([item.value])}
                className={`px-4 py-2 text-sm border rounded-full transition ${
                  selectedPrices.includes(item.value)
                    ? "bg-black text-white border-black"
                    : "hover:border-black"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* SIZE */}
        <div>
          <h3 className="text-sm font-medium mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {["6","7","8","9","10","11","12"].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSizes([size])}
                className={`w-10 h-10 text-sm border rounded-full flex items-center justify-center transition ${
                  selectedSizes.includes(size)
                    ? "bg-black text-white border-black"
                    : "hover:border-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* CLEAR */}
        <button
          onClick={() => {
            setSelectedPrices([]);
            setSelectedSizes([]);
          }}
          className="text-sm underline text-gray-500 hover:text-black"
        >
          Clear All
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <div key={product.id} className="group cursor-pointer">

            {/* IMAGE */}
            <div className="w-full aspect-square bg-white overflow-hidden rounded-xl">
              <img
                src={product.images?.[0]}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* INFO */}
            <div className="mt-3 space-y-1">
              <h3 className="text-sm font-medium line-clamp-2">
                {product.name}
              </h3>

              <p className="text-sm text-gray-500">
                ₹{product.mrp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;