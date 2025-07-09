import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://mwtenoalqvadgcmyszqe.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dGVub2FscXZhZGdjbXlzenFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjAxNDYwMiwiZXhwIjoyMDY3NTkwNjAyfQ.5a8gK66zXx9meZqxhu5YGMoMmy4k5SCpVkJi8ubnan0');

export async function uploadImage(imageUrl: string, userId: number): Promise<string> {
  try {
    // Create a unique filename
    const filename = `generated_images/${userId}_${Date.now()}.jpg`;
    
    // Download the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to download image');
    }
    
    // Convert to blob
    const blob = await response.blob();
    
    // Upload to Supabase storage
    const { error } = await supabase.storage
      .from('generated-images')
      .upload(filename, blob, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('generated-images')
      .getPublicUrl(filename);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}
