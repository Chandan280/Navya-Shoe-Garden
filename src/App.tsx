import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./pages/Product";
import ResetPassword from "./pages/admin/ResetPassword";
import Security from "@/pages/account/Security";
import Orders from "./pages/account/Orders";
import Profile from "./pages/account/Profile";
import { AuthProvider } from "./contexts/AuthContext";
import Addresses from "./pages/account/Addresses";
import Account from "./pages/account/Account";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";

import Index from "./pages/Index";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

import OurStory from "./pages/about/OurStory";
import Sustainability from "./pages/about/Sustainability";
import SizeGuide from "./pages/about/SizeGuide";
import CustomerCare from "./pages/about/CustomerCare";
import StoreLocator from "./pages/about/StoreLocator";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <WishlistProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />

            <BrowserRouter>
              <ScrollToTop />

              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Index />} />

                <Route path="/category/:category" element={<Category />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/products" element={<Product />} />
                <Route path="/checkout" element={<Checkout />} />

                <Route path="/account" element={<Account />} />
                <Route path="/account/security" element={<Security />} />
                <Route path="/account/addresses" element={<Addresses />} />
                <Route path="/account/orders" element={<Orders />} />
                <Route path="/account/profile" element={<Profile />} />

                <Route path="/about/our-story" element={<OurStory />} />
                <Route path="/about/sustainability" element={<Sustainability />} />
                <Route path="/about/size-guide" element={<SizeGuide />} />
                <Route path="/about/customer-care" element={<CustomerCare />} />
                <Route path="/about/store-locator" element={<StoreLocator />} />

                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />

                {/* ADMIN ROUTES */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/reset-password" element={<ResetPassword />} />

                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>

          </AuthProvider>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;