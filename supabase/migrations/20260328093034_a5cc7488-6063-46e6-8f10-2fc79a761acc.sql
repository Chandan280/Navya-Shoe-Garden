CREATE TABLE public.admin_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  otp text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  used boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.admin_otps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role access" ON public.admin_otps
  FOR ALL USING (false);