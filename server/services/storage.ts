import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function uploadImage(imageUrl: string, userId: number): Promise<string> {
  try {
    // Create a unique filename
    const filename = `generated_images/${userId}_${Date.now()}.jpg`;
    const localPath = path.join(__dirname, '..', '..', 'public', filename);
    
    // Download the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to download image');
    }
    
    // Create directories if they don't exist
    await fs.mkdir(path.dirname(localPath), { recursive: true });
    
    // Save to local file
    const buffer = await response.arrayBuffer();
    await fs.writeFile(localPath, Buffer.from(buffer));

    // Return a URL that can be used to access the image
    return `${process.env.SUPABASE_URL}/storage/v1/object/public/generated-images/${filename}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}
