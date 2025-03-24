-- Create featured_projects table
CREATE TABLE IF NOT EXISTS public.featured_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- Add RLS policies
ALTER TABLE public.featured_projects ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Allow public read access" ON public.featured_projects
    FOR SELECT TO public USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users full access" ON public.featured_projects
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert default featured projects
INSERT INTO public.featured_projects (title, description, image_url, link, sort_order)
VALUES 
    ('Events', 'Capturing memorable moments from special events and celebrations.', '/lovable-uploads/9542efdc-b4b2-4089-9182-5656382dc13b.png', '/events', 1),
    ('Places', 'Stunning photography of landscapes, architecture, and beautiful locations.', '/lovable-uploads/69dafa5b-aeba-4a0a-9c92-889afc34f97b.png', '/gallery', 2),
    ('Portrait Series', 'Professional portraits that capture personality and character in every shot.', '/lovable-uploads/cd67a18b-69d7-4832-a636-436e6e50d793.png', '/gallery', 3); 