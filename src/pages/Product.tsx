import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Product = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*");

      if (data) setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Products</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-3 hover:shadow-lg transition"
          >
            <img
              src={product.images?.[0]}
              className="w-full h-48 object-cover"
            />

            <h3 className="mt-2 text-sm font-medium">
              {product.name}
            </h3>

            <p className="text-sm text-gray-500">
              ₹{product.mrp}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;