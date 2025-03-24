-- Create reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    published BOOLEAN DEFAULT false NOT NULL
);

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON public.reviews;
DROP POLICY IF EXISTS "Allow public insert" ON public.reviews;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON public.reviews;

-- Disable RLS temporarily
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;

-- Grant access to public (anonymous) users
GRANT ALL ON public.reviews TO anon;
GRANT ALL ON public.reviews TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Insert some sample reviews if table is empty
INSERT INTO public.reviews (name, email, rating, text, published)
SELECT 
    'John Doe', 'john@example.com', 5, 'Amazing photography service! Captured our special moments perfectly.', true
WHERE NOT EXISTS (SELECT 1 FROM public.reviews LIMIT 1);

INSERT INTO public.reviews (name, email, rating, text, published)
SELECT 
    'Jane Smith', 'jane@example.com', 5, 'Professional and creative. Would highly recommend!', true
WHERE NOT EXISTS (SELECT 1 FROM public.reviews LIMIT 1);

INSERT INTO public.reviews (name, email, rating, text, published)
SELECT 
    'Mike Johnson', 'mike@example.com', 4, 'Great attention to detail and excellent customer service.', true
WHERE NOT EXISTS (SELECT 1 FROM public.reviews LIMIT 1); 