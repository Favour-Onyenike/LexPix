import { supabase } from '@/lib/supabase';

export const configureStorage = async (bucketName: string) => {
  try {
    // Check if bucket exists
    const { data: existingBucket } = await supabase.storage.getBucket(bucketName);

    if (!existingBucket) {
      // Create bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800 // 50MB
      });

      if (createError) throw createError;
    }

    // Update bucket configuration
    const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 52428800
    });

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error('Storage configuration error:', error);
    return false;
  }
};