import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ProductDescription from "../components/product/ProductDescription";
import ProductCarousel from "../components/content/ProductCarousel";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Heart } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ImageZoom from "../components/product/ImageZoom";

interface Product {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  mrp: number;
  discount_percent: number | null;
  final_price: number | null;
  sizes: string[] | null;
  colors: string[] | null;
  stock: number | null;
  images: string[] | null;
  is_new: boolean | null;
}

const ProductDetail = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { toast } = useToast();

  // ================= FETCH =================
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (data) {
        setProduct(data);
        if (data.sizes?.[0]) setSelectedSize(data.sizes[0]);
        if (data.colors?.[0]) setSelectedColor(data.colors[0]);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [productId]);


  // ================= TOUCH SWIPE =================
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const diff = touchStartX.current - touchEndX.current;
    const images = product?.images || [];

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentImageIndex((p) => (p + 1) % images.length);
      } else {
        setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // ================= STATES =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!product) return <div>Product not found</div>;

  const images = product.images || [];
  const inWishlist = isInWishlist(product.id);

  // ================= UI =================
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-10 px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* ================= IMAGES ================= */}
          <div>
            {/* Desktop */}
            <div className="hidden lg:block space-y-8">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square bg-white rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setIsZoomOpen(true);
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x =
                      ((e.clientX - rect.left) / rect.width) * 100;
                    const y =
                      ((e.clientY - rect.top) / rect.height) * 100;

                    e.currentTarget.style.setProperty("--x", `${x}%`);
                    e.currentTarget.style.setProperty("--y", `${y}%`);
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />

                  <img
                    src={image}
                    alt=""
                    className="relative z-10 max-w-[85%] max-h-[85%] object-contain transition-all duration-700 ease-out group-hover:scale-125 drop-shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
                    style={{ transformOrigin: "var(--x) var(--y)" }}
                  />

                  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/20 to-transparent blur-2xl opacity-50" />
                </div>
              ))}
            </div>

            {/* Mobile */}
            <div className="lg:hidden">
              <div
                className="aspect-square bg-white rounded-2xl flex items-center justify-center relative overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => setIsZoomOpen(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />

                <img
                  src={images[currentImageIndex]}
                  className="relative z-10 max-w-[85%] max-h-[85%] object-contain"
                />
              </div>
            </div>

            <ImageZoom
              images={images}
              initialIndex={currentImageIndex}
              isOpen={isZoomOpen}
              onClose={() => setIsZoomOpen(false)}
            />
          </div>

          {/* ================= INFO ================= */}
          <div className="space-y-8">

            <h1 className="text-4xl font-medium tracking-wide">
              {product.name}
            </h1>

            {/* Price */}
            <div>
              {product.discount_percent ? (
                <>
                  <p className="line-through text-gray-400">
                    ₹{product.mrp}
                  </p>
                  <p className="text-3xl font-semibold">
                    ₹{product.final_price}
                  </p>
                </>
              ) : (
                <p className="text-3xl font-semibold">
                  ₹{product.mrp}
                </p>
              )}
            </div>

            {/* Sizes */}
            <div>
              <p className="mb-2">Size</p>
              <div className="flex gap-3">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border rounded-lg transition-all ${
                      selectedSize === size
                        ? "bg-black text-white scale-110 shadow-lg"
                        : "hover:scale-105"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <Button onClick={() => setQuantity(quantity - 1)}>
                <Minus />
              </Button>

              {quantity}

              <Button onClick={() => setQuantity(quantity + 1)}>
                <Plus />
              </Button>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
  onClick={() => {
    if (!selectedSize) {
      alert("Please select size");
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.final_price ?? product.mrp,
      image: product.images?.[0],
      size: selectedSize,
      quantity: quantity,
    });
  }}
  className="flex-1 h-14 text-lg bg-black text-white hover:opacity-90 transition"
>
  Add to Bag
</Button>
              <Button
                onClick={() => toggleItem(product.id)}
                variant="outline"
              >
                <Heart />
              </Button>
            </div>

            {/* Description */}
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>

        {/* Carousel */}
        <div className="mt-24">
          <ProductCarousel />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;