import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { signInWithGoogle } from "@/lib/auth";
import { useEffect } from "react";
import { ArrowRight, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import ShoppingBag from "./ShoppingBag";

interface ShopCategory {
  name: string;
  slug: string;
  children?: ShopCategory[];
}

const shopCategories: ShopCategory[] = [
  {
    name: "Men",
    slug: "men",
    children: [
      { name: "Shoes", slug: "men-shoes" },
      { name: "Formals", slug: "men-formals" },
      { name: "Slippers", slug: "men-slippers" },
      { name: "Sneakers", slug: "sneakers-men" },
    ],
  },
  {
    name: "Women",
    slug: "women",
    children: [
      { name: "Shoes", slug: "women-shoes" },
      { name: "Jutti", slug: "women-jutti" },
      { name: "Slippers", slug: "women-slippers" },
      { name: "Heels", slug: "women-heels" },
      { name: "Sneakers", slug: "sneakers-women" },
    ],
  },
  {
    name: "Kids",
    slug: "kids",
    children: [
      {
        name: "Boys",
        slug: "boys",
        children: [
          { name: "Shoes", slug: "boys-shoes" },
          { name: "Sandals", slug: "boys-sandals" },
          { name: "Slippers", slug: "boys-slippers" },
        ],
      },
      {
        name: "Girls",
        slug: "girls",
        children: [
          { name: "Shoes", slug: "girls-shoes" },
          { name: "Sandals", slug: "girls-sandals" },
          { name: "Slippers", slug: "girls-slippers" },
        ],
      },
    ],
  },
  {
    name: "Sneakers",
    slug: "sneakers",
    children: [
      { name: "Men", slug: "sneakers-men" },
      { name: "Women", slug: "sneakers-women" },
      { name: "Unisex", slug: "sneakers-unisex" },
    ],
  },
];

const Navigation = () => {
  const { user } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [offCanvasType, setOffCanvasType] = useState<'favorites' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShoppingBagOpen, setIsShoppingBagOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string[]>([]);

  const [profileName, setProfileName] = useState("");

  const navigate = useNavigate();

// 🔥 PREMIUM SEARCH
const [search, setSearch] = useState("");
const [debouncedSearch, setDebouncedSearch] = useState("");








  useEffect(() => {
  const fetchProfile = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userData.user.id)
      .single();

    setProfileName(
      data?.full_name || userData.user.email.split("@")[0]
    );
  };

  fetchProfile();
}, []);
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 300);

  return () => clearTimeout(timer);
}, [search]);


  const handleLogout = async () => {
  await supabase.auth.signOut();
};

   
  
  const { totalItems } = useCart();
  const { count: wishlistCount, products: wishlistProducts, toggleItem } = useWishlist();

  const toggleMobileExpand = (key: string) => {
    setExpandedMobile(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const popularSearches = ["Men's Shoes", "Women's Heels", "Kids Sandals", "Slippers", "New Arrivals", "Sale"];
  // 🔥 ADD THIS EXACTLY HERE
const suggestions = [
  "Nike",
  "Adidas",
  "Sneakers",
  "Running Shoes",
  "Formal Shoes",
  "Slippers",
].filter((item) =>
  item.toLowerCase().includes(debouncedSearch.toLowerCase())
);
  const navItems = [
    { name: "Shop", href: "/category/shop" },
    { name: "New In", href: "/category/new-in" },
    { name: "About", href: "/about/our-story" },
  ];

  const renderDesktopShopDropdown = () => (
    <div className="px-6 py-8">
      <div className="flex gap-16">
        {shopCategories.map((cat) => (
          <div key={cat.slug}>
            <Link to={`/category/${cat.slug}`} className="text-nav-foreground hover:text-nav-hover text-sm font-medium block mb-3">
              {cat.name}
            </Link>
            <ul className="space-y-2">
              {cat.children?.map((sub) => (
                <li key={sub.slug}>
                  {sub.children ? (
                    <div>
                      <Link to={`/category/${sub.slug}`} className="text-nav-foreground/70 hover:text-nav-hover text-sm font-light block py-1">{sub.name}</Link>
                      <ul className="pl-4 space-y-1 mt-1">
                        {sub.children.map((subsub) => (
                          <li key={subsub.slug}>
                            <Link to={`/category/${subsub.slug}`} className="text-nav-foreground/50 hover:text-nav-hover text-sm font-light block py-1">{subsub.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <Link to={`/category/${sub.slug}`} className="text-nav-foreground/70 hover:text-nav-hover text-sm font-light block py-1">{sub.name}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMobileShopMenu = () => (
    <div className="mt-3 pl-4 space-y-1">
      {shopCategories.map((cat) => (
        <div key={cat.slug}>
          <button onClick={() => toggleMobileExpand(cat.slug)} className="flex items-center justify-between w-full text-nav-foreground/70 hover:text-nav-hover text-sm font-light py-1">
            <span>{cat.name}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobile.includes(cat.slug) ? 'rotate-180' : ''}`} />
          </button>
          {expandedMobile.includes(cat.slug) && cat.children && (
            <div className="pl-4 space-y-1">
              {cat.children.map((sub) => (
                <div key={sub.slug}>
                  {sub.children ? (
                    <>
                      <button onClick={() => toggleMobileExpand(sub.slug)} className="flex items-center justify-between w-full text-nav-foreground/50 hover:text-nav-hover text-sm font-light py-1">
                        <span>{sub.name}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${expandedMobile.includes(sub.slug) ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedMobile.includes(sub.slug) && (
                        <div className="pl-4 space-y-1">
                          {sub.children.map((subsub) => (
                            <Link key={subsub.slug} to={`/category/${subsub.slug}`} className="text-nav-foreground/40 hover:text-nav-hover text-sm font-light block py-1" onClick={() => setIsMobileMenuOpen(false)}>{subsub.name}</Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link to={`/category/${sub.slug}`} className="text-nav-foreground/50 hover:text-nav-hover text-sm font-light block py-1" onClick={() => setIsMobileMenuOpen(false)}>{sub.name}</Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <nav className="relative" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
      <div className="flex items-center justify-between h-16 px-6">
        <button className="lg:hidden p-2 mt-0.5 text-nav-foreground hover:text-nav-hover transition-colors duration-200" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
          <div className="w-5 h-5 relative">
            <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 top-2.5' : 'top-1.5'}`}></span>
            <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 top-2.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 top-2.5' : 'top-3.5'}`}></span>
          </div>
        </button>

        <div className="hidden lg:flex space-x-8">
          {navItems.map((item) => (
            <div key={item.name} className="relative" onMouseEnter={() => setActiveDropdown(item.name)} onMouseLeave={() => setActiveDropdown(null)}>
              <Link to={item.href} className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light py-6 block">{item.name}</Link>
            </div>
          ))}
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link to="/" className="block">
            <span className="text-sm sm:text-lg font-medium tracking-wide text-foreground whitespace-nowrap">NAVYA SHOE GARDEN</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200" aria-label="Search" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          </button>
          <button className="hidden lg:block p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200 relative" aria-label="Favorites" onClick={() => setOffCanvasType('favorites')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-foreground text-background text-[0.5rem] w-4 h-4 flex items-center justify-center rounded-full">{wishlistCount}</span>
            )}
          </button>
          <button className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200 relative" aria-label="Shopping bag" onClick={() => setIsShoppingBagOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
            {totalItems > 0 && (
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[30%] text-[0.5rem] font-semibold text-black pointer-events-none">{totalItems}</span>
            )}
          </button>
        {/* USER AUTH UI */}
{user ? (
  <div className="relative">
    <button
      onClick={() =>
        setActiveDropdown(activeDropdown === "profile" ? null : "profile")
      }
      className="flex items-center gap-2"
    >
      <img
        src={
          user.user_metadata?.avatar_url ||
         `https://ui-avatars.com/api/?name=${profileName}`
        }
        className="w-9 h-9 rounded-full border"
      />
      <span className="text-sm font-medium hidden md:block">
  {profileName}
</span>
    </button>

    {/* DROPDOWN */}
    {activeDropdown === "profile" && (
      <div className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-xl border rounded-2xl shadow-2xl z-50 overflow-hidden">
        <div className="px-4 py-3 border-b">
          <p className="text-sm font-medium">
            {profileName}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user.email}
          </p>
        </div>

        <div className="flex flex-col text-sm">
          <Link
            to="/account"
            className="px-4 py-2 hover:bg-gray-100"
            onClick={() => setActiveDropdown(null)}
          >
            My Account
          </Link>

          <Link
            to="/account/orders"
            className="px-4 py-2 hover:bg-gray-100"
            onClick={() => setActiveDropdown(null)}
          >
            Orders
          </Link>

          <Link
            to="/account/addresses"
            className="px-4 py-2 hover:bg-gray-100"
            onClick={() => setActiveDropdown(null)}
          >
            Addresses
          </Link>

          <button
            onClick={handleLogout}
            className="text-left px-4 py-2 hover:bg-gray-100 text-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    )}
  </div>
) : (
  <button
    onClick={signInWithGoogle}
    className="text-xs text-nav-foreground hover:text-nav-hover"
  >
    Login
  </button>
)}
        </div>
      </div>

      {activeDropdown === "Shop" && (
        <div className="absolute top-full left-0 right-0 bg-nav border-b border-border z-50" onMouseEnter={() => setActiveDropdown("Shop")} onMouseLeave={() => setActiveDropdown(null)}>
          {renderDesktopShopDropdown()}
        </div>
      )}

      {activeDropdown === "New In" && (
        <div className="absolute top-full left-0 right-0 bg-nav border-b border-border z-50" onMouseEnter={() => setActiveDropdown("New In")} onMouseLeave={() => setActiveDropdown(null)}>
          <div className="px-6 py-8">
            <ul className="space-y-2">
              <li><Link to="/category/new-in" className="text-nav-foreground hover:text-nav-hover text-sm font-light block py-2">This Week's Arrivals</Link></li>
              <li><Link to="/category/new-in" className="text-nav-foreground hover:text-nav-hover text-sm font-light block py-2">Featured Collection</Link></li>
            </ul>
          </div>
        </div>
      )}

      {activeDropdown === "About" && (
        <div className="absolute top-full left-0 right-0 bg-nav border-b border-border z-50" onMouseEnter={() => setActiveDropdown("About")} onMouseLeave={() => setActiveDropdown(null)}>
          <div className="px-6 py-8">
            <ul className="space-y-2">
              <li><Link to="/about/our-story" className="text-nav-foreground hover:text-nav-hover text-sm font-light block py-2">Our Story</Link></li>
              <li><Link to="/about/customer-care" className="text-nav-foreground hover:text-nav-hover text-sm font-light block py-2">Customer Care</Link></li>
              <li><Link to="/about/size-guide" className="text-nav-foreground hover:text-nav-hover text-sm font-light block py-2">Size Guide</Link></li>
            </ul>
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-nav border-b border-border z-50">
          <div className="px-6 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-8">
                <div className="flex items-center border-b border-border pb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-nav-foreground mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                  <input type="text" placeholder="Search for footwear..."value={search}onChange={(e) => setSearch(e.target.value)}onKeyDown={(e) => {if (e.key === "Enter" && search.trim() !== "") {e.preventDefault();navigate(`/category/shop?search=${search}`);setIsSearchOpen(false);setSearch("");}}}className="flex-1 bg-transparent text-nav-foreground placeholder:text-nav-foreground/60 outline-none text-lg"autoFocus/>
                </div>
                {debouncedSearch && suggestions.length > 0 && (
  <div className="absolute left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
    {suggestions.map((item, index) => (
      <div
        key={index}
        onClick={() => {
          navigate(`/category/shop?search=${item}`);
          setIsSearchOpen(false);
          setSearch("");
        }}
        className="cursor-pointer text-sm text-gray-700 hover:text-black hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-200"
      >
        {item}
      </div>
    ))}
  </div>
)}
              </div>
              <div>
                <h3 className="text-nav-foreground text-sm font-light mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-3">
                  {popularSearches.map((item, index) => (
  <button
    key={index}
    onClick={() => {
      navigate(`/category/shop?search=${item}`);
      setIsSearchOpen(false);
    }}
    className="text-nav-foreground hover:text-nav-hover text-sm font-light py-2 px-4 border border-border rounded-full transition-all duration-200 hover:border-nav-hover hover:scale-105 active:scale-95"
  >
    {item}
  </button>
))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-nav border-b border-border z-50">
          <div className="px-6 py-8">
            <div className="space-y-6">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link to={item.href} className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-lg font-light block py-2" onClick={() => item.name !== "Shop" && setIsMobileMenuOpen(false)}>{item.name}</Link>
                  {item.name === "Shop" && renderMobileShopMenu()}
                  {item.name === "About" && (
                    <div className="mt-3 pl-4 space-y-2">
                      <Link to="/about/our-story" className="text-nav-foreground/70 hover:text-nav-hover text-sm font-light block py-1" onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>
                      <Link to="/about/customer-care" className="text-nav-foreground/70 hover:text-nav-hover text-sm font-light block py-1" onClick={() => setIsMobileMenuOpen(false)}>Customer Care</Link>
                      <Link to="/about/size-guide" className="text-nav-foreground/70 hover:text-nav-hover text-sm font-light block py-1" onClick={() => setIsMobileMenuOpen(false)}>Size Guide</Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <ShoppingBag isOpen={isShoppingBagOpen} onClose={() => setIsShoppingBagOpen(false)} onViewFavorites={() => { setIsShoppingBagOpen(false); setOffCanvasType('favorites'); }} />
      
      {offCanvasType === 'favorites' && (
        <div className="fixed inset-0 z-50 h-screen">
          <div className="absolute inset-0 bg-black/50 h-screen" onClick={() => setOffCanvasType(null)} />
          <div className="absolute right-0 top-0 h-screen w-full sm:w-96 bg-background border-l border-border animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-light text-foreground">Your Favorites</h2>
              <button onClick={() => setOffCanvasType(null)} className="p-2 text-foreground hover:text-muted-foreground transition-colors" aria-label="Close"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {wishlistCount === 0 ? (
                <p className="text-muted-foreground text-sm">
                  You haven't added any favorites yet. Browse our collection and click the heart icon to save items you love.
                </p>
              ) : (
                <div className="space-y-4">
                  {wishlistProducts.map((product) => (
                    <div key={product.id} className="flex gap-4 border-b border-border pb-4 last:border-0">
                      <Link to={`/product/${product.id}`} onClick={() => setOffCanvasType(null)} className="w-20 h-20 bg-muted flex-shrink-0 overflow-hidden">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${product.id}`} onClick={() => setOffCanvasType(null)}>
                          <h3 className="text-sm font-medium text-foreground truncate">{product.name}</h3>
                        </Link>
                        <div className="mt-1">
                          {product.discount_percent && product.discount_percent > 0 ? (
                            <div className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition">
                              <span className="text-sm font-light text-foreground">₹{product.final_price}</span>
                              <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
                            </div>
                          ) : (
                            <span className="text-sm font-light text-foreground">₹{product.mrp}</span>
                          )}
                        </div>
                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={() => toggleItem(product.id)}
                            className="text-xs text-muted-foreground hover:text-foreground underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;