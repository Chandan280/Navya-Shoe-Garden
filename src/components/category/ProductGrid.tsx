import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";

interface Product {
  id: string;
  name: string;
  category_id: string | null;
  mrp: number;
  discount_percent: number | null;
  final_price: number | null;
  images: string[] | null;
  is_new: boolean | null;
}

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

const ProductGrid = ({ products, loading }: ProductGridProps) => {
  const { toggleItem, isInWishlist } = useWishlist();

  if (loading) {
    return (
      <section className="w-full px-6 mb-16">
        <p className="text-sm text-muted-foreground">Loading products...</p>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="w-full px-6 mb-16">
        <p className="text-sm text-muted-foreground">No products available yet. Check back soon!</p>
      </section>
    );
  }

  return (
    <section className="w-full px-6 mb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <div key={product.id} className="relative group">
            <Link to={`/product/${product.id}`}>
              <Card className="border-none shadow-none bg-transparent cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-all duration-300" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center"><p className="text-muted-foreground text-xs">No image</p></div>
                    )}
                    <div className="absolute inset-0 bg-black/[0.03]"></div>
                    {product.is_new && (
                      <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-black">NEW</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
                      <div className="text-right">
                        {product.discount_percent && product.discount_percent > 0 ? (
                          <>
                            <p className="text-xs text-muted-foreground line-through">₹{product.mrp}</p>
                            <p className="text-sm font-light text-foreground">₹{product.final_price}</p>
                          </>
                        ) : (
                          <p className="text-sm font-light text-foreground">₹{product.mrp}</p>
                        )}
                      </div>
                    </div>
                    {product.discount_percent && product.discount_percent > 0 && (
                      <p className="text-xs text-green-600">{product.discount_percent}% off</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
            <button
              onClick={(e) => { e.preventDefault(); toggleItem(product.id); }}
              className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-foreground text-foreground' : 'text-foreground'}`} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
