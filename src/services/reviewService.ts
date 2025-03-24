import { supabase } from '@/lib/supabase';

export type Review = {
  id: string;
  name: string;
  email: string;
  rating: number;
  text: string;
  created_at: string;
  published: boolean;
};

// Get published reviews with optional limit
export const getPublishedReviews = async (limit?: number): Promise<Review[]> => {
  try {
    const query = supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (limit) {
      query.limit(limit);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const createReview = async (review: Omit<Review, 'id' | 'created_at'>): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        ...review,
        published: true // Always set published to true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating review:', error);
    return null;
  }
};

// Get all reviews for admin
export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

// Submit a new review
export const submitReview = async (reviewData: {
  name: string;
  email: string;
  rating: number;
  text: string;
}): Promise<Review | null> => {
  try {
    console.log('Submitting review:', reviewData);
    
    const insertData = {
      ...reviewData,
      published: true,
      created_at: new Date().toISOString()
    };
    
    // Insert the review and return the inserted row
    const { data, error: insertError } = await supabase
      .from('reviews')
      .insert([insertData])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error(insertError.message);
    }

    // Return the actual inserted review
    return data;
  } catch (error) {
    console.error('Error submitting review:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to submit review: ${error.message}`);
    }
    throw new Error('Failed to submit review: Unknown error');
  }
};

// Update review published status
export const updateReviewStatus = async (id: string, published: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({ published })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating review status:', error);
    return false;
  }
};

// Delete a review
export const deleteReview = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
};
