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
  discount_percent: number;
  final_price: number;
  images: string[];
  is_new: boolean;
}

const ProductCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);
      if (data) setProducts(data);
    };
    fetchProducts();
  }, []);

  if (products.length === 0) {
    return (
      <section className="w-full mb-16 px-6">
        <p className="text-sm text-muted-foreground">No products available yet. Add products from the admin panel.</p>
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
        <CarouselContent className="">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
            >
              <Link to={`/product/${product.id}`}>
                <Card className="border-none shadow-none bg-transparent group">
                  <CardContent className="p-0">
                    <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-all duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <p className="text-muted-foreground text-xs">No image</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/[0.03]"></div>
                      {product.is_new && (
                        <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-black">
                          NEW
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-foreground">
                          {product.name}
                        </h3>
                        <div className="text-right">
                          {product.discount_percent > 0 && (
                            <p className="text-xs text-muted-foreground line-through">₹{product.mrp}</p>
                          )}
                          <p className="text-sm font-light text-foreground">
                            ₹{product.final_price}
                          </p>
                        </div>
                      </div>
                      {product.discount_percent > 0 && (
                        <p className="text-xs text-green-600">{product.discount_percent}% off</p>
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
