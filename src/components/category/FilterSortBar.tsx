import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Filters } from "@/pages/Category";

interface FilterSortBarProps {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  itemCount: number | null;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  availableColors: string[];
}

const priceRanges = [
  "Under ₹1500",
  "₹1500 - ₹3000",
  "₹3000 - ₹6000",
  "Above ₹6000"
];
const sizes = ["6", "7", "8", "9", "10", "11", "12"]

const toggleArrayItem = (arr: string[], item: string) =>
  arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

const FilterSortBar = ({ filtersOpen, setFiltersOpen, itemCount, filters, setFilters, availableColors }: FilterSortBarProps) => {

  const activeFilterCount =
    filters.priceRanges.length + filters.sizes.length + filters.colors.length;

  return (
    <>
      <section className="w-full px-6 mb-8 border-b border-border pb-4">
        <div className="flex justify-between items-center">
          <p className="text-sm font-light text-muted-foreground">
            {itemCount !== null ? `${itemCount} items` : "Loading..."}
          </p>
          
          <div className="flex items-center gap-4">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="font-light hover:bg-transparent"
                >
                  Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80 bg-background border-none shadow-none">
                <SheetHeader className="mb-6 border-b border-border pb-4">
                  <SheetTitle className="text-lg font-light">Filters</SheetTitle>
                </SheetHeader>
                
                <div className="space-y-8">
                  {/* Price Filter */}
                  <div>
                    <h3 className="text-sm font-light mb-4 text-foreground">Price</h3>
                    <div className="space-y-3">
                      {priceRanges.map((range) => (
                        <div key={range} className="flex items-center space-x-3">
                          <Checkbox
                            id={range}
                            checked={filters.priceRanges.includes(range)}
                            onCheckedChange={() =>
                              setFilters((prev) => ({
                                ...prev,
                                priceRanges: toggleArrayItem(prev.priceRanges, range),
                              }))
                            }
                            className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                          />
                          <Label htmlFor={range} className="text-sm font-light text-foreground cursor-pointer">
                            {range}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="border-border" />

                  {/* Size Filter */}
                  <div>
                    <h3 className="text-sm font-light mb-4 text-foreground">Size</h3>
                    <div className="space-y-3">
                      {sizes.map((size) => (
                        <div key={size} className="flex items-center space-x-3">
                          <Checkbox
                            id={`size-${size}`}
                            checked={filters.sizes.includes(size)}
                            onCheckedChange={() =>
                              setFilters((prev) => ({
                                ...prev,
                                sizes: toggleArrayItem(prev.sizes, size),
                              }))
                            }
                            className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                          />
                          <Label htmlFor={`size-${size}`} className="text-sm font-light text-foreground cursor-pointer">
                            Size {size}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="border-border" />

                  {/* Color Filter */}
                  {availableColors.length > 0 && (
                    <>
                      <div>
                        <h3 className="text-sm font-light mb-4 text-foreground">Color</h3>
                        <div className="space-y-3">
                          {availableColors.map((color) => (
                            <div key={color} className="flex items-center space-x-3">
                              <Checkbox
                                id={`color-${color}`}
                                checked={filters.colors.includes(color)}
                                onCheckedChange={() =>
                                  setFilters((prev) => ({
                                    ...prev,
                                    colors: toggleArrayItem(prev.colors, color),
                                  }))
                                }
                                className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                              />
                              <Label htmlFor={`color-${color}`} className="text-sm font-light text-foreground cursor-pointer">
                                {color}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Separator className="border-border" />
                    </>
                  )}

                  <div className="flex flex-col gap-2 pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full border-none hover:bg-transparent hover:underline font-light text-left justify-start"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRanges: [],
                          sizes: [],
                          colors: [],
                        }))
                      }
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Select
              value={filters.sortBy}
              onValueChange={(val) => setFilters((prev) => ({ ...prev, sortBy: val }))}
            >
              <SelectTrigger className="w-auto border-none bg-transparent text-sm font-light shadow-none rounded-none pr-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="shadow-none border-none rounded-none bg-background">
                <SelectItem value="featured" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Featured</SelectItem>
                <SelectItem value="price-low" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Price: High to Low</SelectItem>
                <SelectItem value="newest" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Newest</SelectItem>
                <SelectItem value="name" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </>
  );
};

export default FilterSortBar;
