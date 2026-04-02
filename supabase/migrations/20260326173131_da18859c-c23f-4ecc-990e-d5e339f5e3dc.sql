
-- Create admin role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  mrp NUMERIC(10,2) NOT NULL,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  final_price NUMERIC(10,2) GENERATED ALWAYS AS (mrp - (mrp * discount_percent / 100)) STORED,
  sizes TEXT[] DEFAULT ARRAY['6','7','8','9','10'],
  colors TEXT[] DEFAULT ARRAY['Black','Brown','White'],
  stock INT DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Cart items table
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own cart" ON public.cart_items FOR ALL USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);
CREATE POLICY "Anyone can add to cart" ON public.cart_items FOR INSERT WITH CHECK (true);

-- Wishlist table
CREATE TABLE public.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id),
  UNIQUE(session_id, product_id)
);
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their wishlist" ON public.wishlist FOR ALL USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);
CREATE POLICY "Anyone can add to wishlist" ON public.wishlist FOR INSERT WITH CHECK (true);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('COD', 'Online')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  order_status TEXT DEFAULT 'placed' CHECK (order_status IN ('placed', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (
  auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  product_name TEXT NOT NULL,
  quantity INT NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order items viewable with order" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage order items" ON public.order_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Product images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
CREATE POLICY "Product images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- Seed categories
INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Men', 'men', 1),
  ('Women', 'women', 2),
  ('Kids', 'kids', 3);

INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES
  ('Boys', 'boys', (SELECT id FROM public.categories WHERE slug = 'kids'), 1),
  ('Girls', 'girls', (SELECT id FROM public.categories WHERE slug = 'kids'), 2);

-- Subcategories for Men
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES
  ('Shoes', 'men-shoes', (SELECT id FROM public.categories WHERE slug = 'men'), 1),
  ('Sandals', 'men-sandals', (SELECT id FROM public.categories WHERE slug = 'men'), 2),
  ('Slippers', 'men-slippers', (SELECT id FROM public.categories WHERE slug = 'men'), 3);

-- Subcategories for Women
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES
  ('Shoes', 'women-shoes', (SELECT id FROM public.categories WHERE slug = 'women'), 1),
  ('Sandals', 'women-sandals', (SELECT id FROM public.categories WHERE slug = 'women'), 2),
  ('Slippers', 'women-slippers', (SELECT id FROM public.categories WHERE slug = 'women'), 3),
  ('Heels', 'women-heels', (SELECT id FROM public.categories WHERE slug = 'women'), 4);

-- Subcategories for Boys
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES
  ('Shoes', 'boys-shoes', (SELECT id FROM public.categories WHERE slug = 'boys'), 1),
  ('Sandals', 'boys-sandals', (SELECT id FROM public.categories WHERE slug = 'boys'), 2),
  ('Slippers', 'boys-slippers', (SELECT id FROM public.categories WHERE slug = 'boys'), 3);

-- Subcategories for Girls
INSERT INTO public.categories (name, slug, parent_id, sort_order) VALUES
  ('Shoes', 'girls-shoes', (SELECT id FROM public.categories WHERE slug = 'girls'), 1),
  ('Sandals', 'girls-sandals', (SELECT id FROM public.categories WHERE slug = 'girls'), 2),
  ('Slippers', 'girls-slippers', (SELECT id FROM public.categories WHERE slug = 'girls'), 3);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
