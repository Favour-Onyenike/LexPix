-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read published reviews
CREATE POLICY "Allow public read access to published reviews"
ON public.reviews
FOR SELECT
TO public
USING (published = true);

-- Allow anyone to insert reviews (but they'll be unpublished by default)
CREATE POLICY "Allow public to submit reviews"
ON public.reviews
FOR INSERT
TO public
WITH CHECK (true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Allow authenticated users full access"
ON public.reviews
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true); 