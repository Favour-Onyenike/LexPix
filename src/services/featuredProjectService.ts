import { supabase } from '@/lib/supabase';
import { uploadFile } from './storageService';
import { configureStorage } from './storageConfig';

export type FeaturedProject = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// Get all featured projects
export const getFeaturedProjects = async (): Promise<FeaturedProject[]> => {
  try {
    const { data, error } = await supabase
      .from('featured_projects')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
};

// Update a featured project
export const updateFeaturedProject = async (
  id: string,
  updates: Partial<FeaturedProject>,
  newImage?: File
): Promise<FeaturedProject | null> => {
  try {
    let imageUrl = updates.image_url;

    if (newImage) {
      imageUrl = await uploadFile(newImage, 'featured-projects');
      if (!imageUrl) throw new Error('Failed to upload image');
    }

    const { data, error } = await supabase
      .from('featured_projects')
      .update({
        ...updates,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating featured project:', error);
    return null;
  }
};

// Update the sort order of featured projects
export const updateProjectOrder = async (projectIds: string[]): Promise<boolean> => {
  try {
    // First, get the existing projects to preserve their data
    const { data: existingProjects } = await supabase
      .from('featured_projects')
      .select('*')
      .in('id', projectIds);

    if (!existingProjects) return false;

    // Create updates with all required fields
    const updates = existingProjects.map((project, index) => ({
      ...project,
      sort_order: index + 1
    }));

    const { error } = await supabase
      .from('featured_projects')
      .upsert(updates)
      .select();

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating project order:', error);
    return false;
  }
};


// Add this at the start of your file
const initializeStorage = async () => {
  await configureStorage('featured-projects');
};

// Call this when your application starts
initializeStorage();