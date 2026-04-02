import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import CategoryHeader from "../components/category/CategoryHeader";
import FilterSortBar from "../components/category/FilterSortBar";
import ProductGrid from "../components/category/ProductGrid";
import { supabase } from "@/integrations/supabase/client";

export interface Filters {
  categories: string[];
  priceRanges: string[];
  sizes: string[];
  colors: string[];
  sortBy: string;
}

const Category = () => {
  const { category } = useParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRanges: [],
    sizes: [],
    colors: [],
    sortBy: "featured",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from("products").select("*");

      if (category && category !== "shop" && category !== "new-in") {
        const { data: cats } = await supabase.from("categories").select("id, slug, parent_id");
        if (cats) {
          const matchCat = cats.find((c) => c.slug === category);
          if (matchCat) {
            const getCategoryIds = (parentId: string): string[] => {
              const children = cats.filter((c) => c.parent_id === parentId);
              return [parentId, ...children.flatMap((c) => getCategoryIds(c.id))];
            };
            query = query.in("category_id", getCategoryIds(matchCat.id));
          }
        }
      }

      if (category === "new-in") {
        query = query.eq("is_new", true);
      }

      const { data } = await query;
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [category]);

  // Apply client-side filters and sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Price range filter
    if (filters.priceRanges.length > 0) {
      result = result.filter((p) => {
        const price = p.final_price ?? p.mrp;
        return filters.priceRanges.some((range) => {
          if (range === "Under ₹500") return price < 500;
          if (range === "₹500 - ₹1,000") return price >= 500 && price <= 1000;
          if (range === "₹1,000 - ₹2,000") return price >= 1000 && price <= 2000;
          if (range === "Over ₹2,000") return price > 2000;
          return true;
        });
      });
    }

    // Size filter
    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes && filters.sizes.some((s) => p.sizes.includes(s))
      );
    }

    // Color filter
    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors && filters.colors.some((c) => p.colors.includes(c))
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => (a.final_price ?? a.mrp) - (b.final_price ?? b.mrp));
        break;
      case "price-high":
        result.sort((a, b) => (b.final_price ?? b.mrp) - (a.final_price ?? a.mrp));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [products, filters]);

  // Extract available colors from products for filter options
  const availableColors = useMemo(() => {
    const colorSet = new Set<string>();
    products.forEach((p) => p.colors?.forEach((c: string) => colorSet.add(c)));
    return Array.from(colorSet).sort();
  }, [products]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-6">
        <CategoryHeader category={category || "All Products"} />
        
        <FilterSortBar
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          itemCount={filteredProducts.length}
          filters={filters}
          setFilters={setFilters}
          availableColors={availableColors}
        />
        
        <ProductGrid products={filteredProducts} loading={loading} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Category;
