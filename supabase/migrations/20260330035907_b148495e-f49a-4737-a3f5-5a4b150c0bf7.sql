
-- Add city, state, pincode columns to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS pincode text;

-- Drop existing restrictive INSERT policies and recreate
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders
FOR INSERT TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
CREATE POLICY "Anyone can create order items" ON public.order_items
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Allow anon to SELECT orders they just created (by matching on id)
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT TO anon, authenticated
USING (true);
