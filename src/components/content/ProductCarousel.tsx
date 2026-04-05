import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  category_id: string;
  mrp: number;
  discount: number; // ✅ FIXED
  final_price: number;
  images: string[];
  is_new: boolean;
}

const ProductCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);

      if (data) setProducts(data);
    };

    fetchProducts();
  }, []);

  if (products.length === 0) {
    return (
      <section className="w-full mb-16 px-6">
        <p className="text-sm text-muted-foreground">
          No products available yet. Add products from the admin panel.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full mb-16 px-6">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
            >
              <Link to={`/product/${product.id}`}>
                <Card className="border-none shadow-none bg-transparent group">
                  <CardContent className="p-0">

                    {/* IMAGE */}
                    <div className="aspect-square mb-3 overflow-hidden bg-white relative rounded-xl">
                      {product.images?.[0] ? (
  <div className="w-full h-full flex items-center justify-center bg-white">

    <img
      src={product.images[0]}
      alt={product.name}
      className="max-h-[80%] object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
    />

  </div>
) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <p className="text-muted-foreground text-xs">
                            No image
                          </p>
                        </div>
                      )}

                      {/* OVERLAY */}
                      <div className="absolute inset-0 bg-black/[0.03]" />

                      {/* NEW TAG */}
                      {product.is_new && (
                        <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-black bg-white/80 backdrop-blur-sm">
                          NEW
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="space-y-1">

                      <div>
  <h3 className="text-sm font-semibold text-black tracking-tight">
    {product.name}
  </h3>

  <div className="mt-1 flex items-center gap-2">

    {/* FINAL PRICE */}
    <span className="text-base font-semibold text-black">
      ₹{product.final_price}
    </span>

    {/* ORIGINAL PRICE */}
    {product.discount_percent > 0 && (
      <span className="text-sm text-gray-400 line-through">
        ₹{product.mrp}
      </span>
    )}

    {/* DISCOUNT */}
    {product.discount_percent > 0 && (
      <span className="text-xs text-green-600 font-medium">
        {product.discount_percent}% OFF
      </span>
    )}

  </div>
</div>

                      {product.discount > 0 && (
                        <p className="text-xs text-green-600">
                          {product.discount}% off
                        </p>
                      )}

                    </div>

                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ProductCarousel;