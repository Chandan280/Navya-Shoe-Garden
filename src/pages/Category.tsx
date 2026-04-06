import { useSearchParams } from "react-router-dom"; // ✅ ADDED
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

type CategoryType = {
  id: string;
  slug: string;
  parent_id: string | null;
};

const Category = () => {
  const { category } = useParams();

  // ✅ ADDED (URL SEARCH SUPPORT)
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRanges: [],
    sizes: [],
    colors: [],
    sortBy: "featured",
  });

  // 🔥 SYNC URL SEARCH → INPUT (NEW)
  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      let query = supabase.from("products").select("*");

      if (category && category !== "shop" && category !== "new-in") {
        const { data: cats } = (await supabase
          .from("categories")
          .select("id, slug, parent_id")) as {
          data: CategoryType[] | null;
        };

        if (cats && Array.isArray(cats)) {
          const matchCat = cats.find((c) => c.slug === category);

          if (matchCat) {
            const getCategoryIds = (parentId: string): string[] => {
              const children = cats.filter((c) => c.parent_id === parentId);

              return [
                parentId,
                ...children.flatMap((c) => getCategoryIds(c.id)),
              ];
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

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 🔥 UPDATED SEARCH (USES URL + INPUT BOTH)
    const finalSearch = (urlSearch || searchQuery).toLowerCase();

    if (finalSearch.trim() !== "") {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(finalSearch)
      );
    }

    // 💰 PRICE FILTER
    if (filters.priceRanges.length > 0) {
      result = result.filter((p) => {
        const price = p.final_price ?? p.mrp;

        return filters.priceRanges.some((range) => {
          if (range === "Under ₹1500") return price < 1500;
          if (range === "₹1500 - ₹3000")
            return price >= 1500 && price <= 3000;
          if (range === "₹3000 - ₹6000")
            return price >= 3000 && price <= 6000;
          if (range === "Above ₹6000") return price > 6000;

          return true;
        });
      });
    }

    // 👟 SIZE FILTER
    if (filters.sizes.length > 0) {
      result = result.filter(
        (p) =>
          p.sizes &&
          filters.sizes.some((s) => p.sizes.includes(s))
      );
    }

    // 🎨 COLOR FILTER
    if (filters.colors.length > 0) {
      result = result.filter(
        (p) =>
          p.colors &&
          filters.colors.some((c) => p.colors.includes(c))
      );
    }

    // 🔥 SORTING
    switch (filters.sortBy) {
      case "price-low":
        result.sort(
          (a, b) =>
            (a.final_price ?? a.mrp) - (b.final_price ?? b.mrp)
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            (b.final_price ?? b.mrp) - (a.final_price ?? a.mrp)
        );
        break;

      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
        break;

      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
    }

    return result;
  }, [products, filters, searchQuery, urlSearch]); // ✅ UPDATED

  const availableColors = useMemo(() => {
    const colorSet = new Set<string>();

    products.forEach((p) =>
      p.colors?.forEach((c: string) => colorSet.add(c))
    );

    return Array.from(colorSet).sort();
  }, [products]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-6">
        <CategoryHeader category={category || "All Products"} />

        <div className="px-6 md:px-10 mb-6">
          <input
            type="text"
            placeholder="Search for shoes, sneakers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-black transition"
          />
        </div>

        <FilterSortBar
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          itemCount={filteredProducts.length}
          filters={filters}
          setFilters={setFilters}
          availableColors={availableColors}
        />

        <ProductGrid
          products={filteredProducts}
          loading={loading}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Category;