import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

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

const ALL_SIZES = ["6", "7", "8", "9", "10"];
const ALL_COLORS = ["Black", "Brown", "White"];

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [mrp, setMrp] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [sizes, setSizes] = useState<string[]>(ALL_SIZES);
  const [colors, setColors] = useState<string[]>(ALL_COLORS);
  const [stock, setStock] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    if (data) setCategories(data);
  };

  const getCategoryPath = (catId: string): string => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return "";
    if (cat.parent_id) {
      return `${getCategoryPath(cat.parent_id)} > ${cat.name}`;
    }
    return cat.name;
  };

  // Only show leaf categories (no children)
  const leafCategories = categories.filter(
    (cat) => !categories.some((c) => c.parent_id === cat.id)
  );

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategoryId("");
    setMrp("");
    setDiscountPercent("");
    setSizes(ALL_SIZES);
    setColors(ALL_COLORS);
    setStock("");
    setIsNew(false);
    setImages([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setName(product.name);
    setDescription(product.description || "");
    setCategoryId(product.category_id || "");
    setMrp(String(product.mrp));
    setDiscountPercent(String(product.discount_percent || 0));
    setSizes(product.sizes || ALL_SIZES);
    setColors(product.colors || ALL_COLORS);
    setStock(String(product.stock || 0));
    setIsNew(product.is_new || false);
    setImages(product.images || []);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);

    const newImages: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        continue;
      }

      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
      newImages.push(urlData.publicUrl);
    }

    setImages((prev) => [...prev, ...newImages]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const mrpVal = parseFloat(mrp);
    const discVal = parseFloat(discountPercent) || 0;
    const finalPrice = mrpVal - (mrpVal * discVal) / 100;

    const productData = {
      name,
      description: description || null,
      category_id: categoryId || null,
      mrp: mrpVal,
      discount_percent: discVal,
      sizes,
      colors,
      stock: parseInt(stock) || 0,
      is_new: isNew,
      images,
    };

    if (editingId) {
      const { error } = await supabase.from("products").update(productData).eq("id", editingId);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Product updated" });
    } else {
      const { error } = await supabase.from("products").insert(productData);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Product added" });
    }

    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Product deleted" });
    fetchProducts();
  };

  const calculatedFinalPrice = mrp && discountPercent
    ? (parseFloat(mrp) - (parseFloat(mrp) * parseFloat(discountPercent)) / 100).toFixed(2)
    : mrp || "0";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-light text-foreground">Products</h2>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-foreground text-background hover:bg-foreground/90 rounded-none font-light"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="border border-border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-light text-foreground">
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-light">Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required className="rounded-none" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-light">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="rounded-none">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {leafCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {getCategoryPath(cat.id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-light">MRP (₹) *</Label>
                <Input type="number" value={mrp} onChange={(e) => setMrp(e.target.value)} required className="rounded-none" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-light">Discount %</Label>
                <Input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} className="rounded-none" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-light">Final Price (auto)</Label>
                <Input value={`₹${calculatedFinalPrice}`} disabled className="rounded-none bg-muted" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-light">Stock</Label>
                <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="rounded-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-light">Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-none" />
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <Label className="text-sm font-light">Sizes</Label>
              <div className="flex gap-4">
                {ALL_SIZES.map((size) => (
                  <label key={size} className="flex items-center gap-2 text-sm font-light">
                    <Checkbox
                      checked={sizes.includes(size)}
                      onCheckedChange={(checked) => {
                        if (checked) setSizes((prev) => [...prev, size]);
                        else setSizes((prev) => prev.filter((s) => s !== size));
                      }}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <Label className="text-sm font-light">Colors</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {colors.map((color) => (
                  <span key={color} className="flex items-center gap-1 px-2 py-1 bg-muted text-sm font-light rounded">
                    {color}
                    <button type="button" onClick={() => setColors((prev) => prev.filter((c) => c !== color))} className="hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a color and press Enter"
                  className="text-sm font-light"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val && !colors.includes(val)) {
                        setColors((prev) => [...prev, val]);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Is New */}
            <label className="flex items-center gap-2 text-sm font-light">
              <Checkbox checked={isNew} onCheckedChange={(c) => setIsNew(!!c)} />
              Mark as New
            </label>

            {/* Images */}
            <div className="space-y-2">
              <Label className="text-sm font-light">Images</Label>
              <div className="flex flex-wrap gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-foreground text-background rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 border border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
            </div>

            <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90 rounded-none font-light">
              {editingId ? "Update Product" : "Add Product"}
            </Button>
          </form>
        </div>
      )}

      {/* Products List */}
      {products.length === 0 ? (
        <p className="text-muted-foreground text-sm">No products yet. Add your first product above.</p>
      ) : (
        <div className="border border-border">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left">
                <th className="p-4 text-sm font-light text-muted-foreground">Image</th>
                <th className="p-4 text-sm font-light text-muted-foreground">Name</th>
                <th className="p-4 text-sm font-light text-muted-foreground">Category</th>
                <th className="p-4 text-sm font-light text-muted-foreground">MRP</th>
                <th className="p-4 text-sm font-light text-muted-foreground">Discount</th>
                <th className="p-4 text-sm font-light text-muted-foreground">Final Price</th>
                <th className="p-4 text-sm font-light text-muted-foreground">Stock</th>
                <th className="p-4 text-sm font-light text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="p-4">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt="" className="w-12 h-12 object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-muted" />
                    )}
                  </td>
                  <td className="p-4 text-sm font-light">{product.name}</td>
                  <td className="p-4 text-sm font-light text-muted-foreground">
                    {product.category_id ? getCategoryPath(product.category_id) : "—"}
                  </td>
                  <td className="p-4 text-sm font-light">₹{product.mrp}</td>
                  <td className="p-4 text-sm font-light">{product.discount_percent || 0}%</td>
                  <td className="p-4 text-sm font-light">₹{product.final_price}</td>
                  <td className="p-4 text-sm font-light">{product.stock}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)} className="p-1 hover:text-foreground text-muted-foreground">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1 hover:text-destructive text-muted-foreground">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
