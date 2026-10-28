ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image_url text NOT NULL DEFAULT '';
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;