import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from '../config';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
