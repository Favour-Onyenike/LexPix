import { supabase } from '@/lib/supabase';

export const initializeStorage = async (bucketName: string) => {
  try {
    // Check if bucket exists
    const { data: bucket } = await supabase.storage.getBucket(bucketName);
    
    if (!bucket) {
      // Create bucket if it doesn't exist
      await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800 // 50MB limit
      });
    }
    
    return true;
  } catch (error) {
    console.error('Storage initialization error:', error);
    return false;
  }
};

export const uploadFile = async (file: File, bucketName: string) => {
  try {
    await initializeStorage(bucketName);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
      
    return publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    return null;
  }
};