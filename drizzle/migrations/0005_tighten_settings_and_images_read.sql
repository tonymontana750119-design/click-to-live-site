DROP POLICY IF EXISTS "public read" ON public.settings;
CREATE POLICY "public read" ON public.settings FOR SELECT TO anon, authenticated USING (id = 1);
DROP POLICY IF EXISTS "img public read" ON storage.objects;
CREATE POLICY "img admin read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'::public.app_role));