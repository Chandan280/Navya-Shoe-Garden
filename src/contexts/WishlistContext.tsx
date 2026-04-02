import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface WishlistProduct {
  id: string;
  name: string;
  mrp: number;
  final_price: number | null;
  discount_percent: number | null;
  images: string[] | null;
}

interface WishlistContextType {
  items: string[];
  products: WishlistProduct[];
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  count: number;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<string[]>(() => {
    const saved = localStorage.getItem("navya-wishlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("navya-wishlist", JSON.stringify(items));
  }, [items]);

  // Fetch product details whenever items change
  useEffect(() => {
    if (items.length === 0) {
      setProducts([]);
      return;
    }
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("id, name, mrp, final_price, discount_percent, images")
        .in("id", items);
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [items]);

  const toggleItem = (productId: string) => {
    setItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => items.includes(productId);

  return (
    <WishlistContext.Provider value={{ items, products, toggleItem, isInWishlist, count: items.length, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
