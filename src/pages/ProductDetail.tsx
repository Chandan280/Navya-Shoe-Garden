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
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
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

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      const { data } = await supabase.from("products").select("*").eq("id", productId).single();
      if (data) {
        setProduct(data);
        if (data.sizes?.[0]) setSelectedSize(data.sizes[0]);
        if (data.colors?.[0]) setSelectedColor(data.colors[0]);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize || !selectedColor) {
      toast({ title: "Please select size and color", variant: "destructive" });
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.final_price || product.mrp,
      mrp: product.mrp,
      image: product.images?.[0] || "",
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
    toast({ title: "Added to bag!" });
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const images = product?.images || [];
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentImageIndex((p) => (p + 1) % images.length);
      else setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-24"><p className="text-muted-foreground">Loading...</p></div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-24"><p className="text-muted-foreground">Product not found.</p></div>
        <Footer />
      </div>
    );
  }

  const images = product.images || [];
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-6">
        <section className="w-full px-6">
          <div className="lg:hidden mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>{product.name}</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="w-full">
              {/* Desktop */}
              <div className="hidden lg:block">
                <div className="space-y-4">
                  {images.map((image, index) => (
                    <div key={index} className="w-full aspect-square overflow-hidden cursor-pointer group" onClick={() => { setCurrentImageIndex(index); setIsZoomOpen(true); }}>
                      <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                  ))}
                  {images.length === 0 && <div className="w-full aspect-square bg-muted flex items-center justify-center"><p className="text-muted-foreground text-sm">No images</p></div>}
                </div>
              </div>
              {/* Mobile */}
              <div className="lg:hidden">
                <div className="relative">
                  <div className="w-full aspect-square overflow-hidden cursor-pointer touch-pan-y" onClick={() => setIsZoomOpen(true)} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                    {images[currentImageIndex] ? (
                      <img src={images[currentImageIndex]} alt={product.name} className="w-full h-full object-cover select-none" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center"><p className="text-muted-foreground text-sm">No image</p></div>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                      {images.map((_, index) => (
                        <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-foreground' : 'bg-muted'}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <ImageZoom images={images} initialIndex={currentImageIndex} isOpen={isZoomOpen} onClose={() => setIsZoomOpen(false)} />
            </div>
            
            {/* Product Info */}
            <div className="lg:pl-12 mt-8 lg:mt-0 lg:sticky lg:top-6 lg:h-fit">
              <div className="space-y-6">
                <div className="hidden lg:block">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem><BreadcrumbPage>{product.name}</BreadcrumbPage></BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-medium tracking-wide text-foreground">{product.name}</h1>
                    </div>
                    <div className="text-right space-y-1">
                      {product.discount_percent && product.discount_percent > 0 ? (
                        <>
                         <p className="text-sm text-gray-400 line-through">₹{product.mrp}</p>
                         <p className="text-2xl font-medium">₹{product.final_price}</p>
                         <p className="text-xs text-green-600">{product.discount_percent}% OFF</p>
                        </>
                      ) : (
                        <p className="text-xl font-light text-foreground">₹{product.mrp}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Size Selection */}
                <div className="space-y-3 py-4 border-b border-border">
                  <h3 className="text-sm font-light text-foreground">Size</h3>
                  <div className="flex gap-2">
                    {(product.sizes || []).map((size) => (
                      <button
  key={size}
  onClick={() => setSelectedSize(size)}
  className={`w-14 h-14 rounded-lg border text-sm font-medium flex items-center justify-center transition-all duration-200 ${
    selectedSize === size
      ? "bg-black text-white border-black shadow-md scale-105"
      : "bg-white text-black border-gray-300 hover:border-black hover:scale-105"
  }`}
>
  {size}
</button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="space-y-3 py-4 border-b border-border">
                  <h3 className="text-sm font-light text-foreground">Color</h3>
                  <div className="flex gap-3">
                    {(product.colors || []).map((color) => (
                      <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 border text-sm font-light transition-colors ${selectedColor === color ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground hover:border-foreground'}`}>
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {product.description && (
                  <div className="space-y-2 py-4 border-b border-border">
                    <h3 className="text-sm font-light text-foreground">Description</h3>
                    <p className="text-sm font-light text-muted-foreground">{product.description}</p>
                  </div>
                )}

                {/* Quantity, Add to Cart, Wishlist */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-light text-foreground">Quantity</span>
                    <div className="flex items-center border border-border">
                      <Button variant="ghost" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"><Minus className="h-4 w-4" /></Button>
                      <span className="h-10 flex items-center px-4 text-sm font-light min-w-12 justify-center border-l border-r border-border">{quantity}</span>
                      <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)} className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"><Plus className="h-4 w-4" /></Button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleAddToCart} className="flex-1 h-12 bg-foreground text-background hover:bg-foreground/90 font-light rounded-none">
                      Add to Bag
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => { toggleItem(product.id); toast({ title: inWishlist ? "Removed from wishlist" : "Added to wishlist" }); }} className={`h-12 w-12 rounded-none ${inWishlist ? 'bg-foreground text-background hover:bg-foreground/90' : ''}`}>
                      <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
                    </Button>
                  </div>

                  {product.stock !== null && product.stock <= 5 && product.stock > 0 && (
                    <p className="text-xs text-destructive">Only {product.stock} left in stock!</p>
                  )}
                  {product.stock === 0 && (
                    <p className="text-xs text-destructive">Out of stock</p>
                  )}
                </div>
              </div>
              <ProductDescription />
            </div>
          </div>
        </section>
        
        <section className="w-full mt-16 lg:mt-24">
          <div className="mb-4 px-6">
            <h2 className="text-sm font-light text-foreground">You might also like</h2>
          </div>
          <ProductCarousel />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
