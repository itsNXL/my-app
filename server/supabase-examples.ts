import { supabase } from './supabase';
import { storage } from './storage';

// Example: Supabase Auth integration
export async function signUpUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Create user record in our database
  if (data.user) {
    await storage.createUser({
      username: email,
      password: '', // We don't store passwords in our DB when using Supabase Auth
      isAdmin: false,
    });
  }
  
  return data;
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
}

// Example: Supabase Storage for file uploads
export async function uploadImage(file: File, bucket: string = 'images') {
  const fileName = `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  
  return {
    path: data.path,
    url: urlData.publicUrl,
  };
}

// Example: Real-time subscriptions
export function subscribeToThemeUpdates(callback: (payload: any) => void) {
  return supabase
    .channel('theme_updates')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'themes' }, 
      callback
    )
    .subscribe();
}

// Example: Row Level Security (RLS) helper
export function getCurrentUser() {
  return supabase.auth.getUser();
}

// Example: Using Supabase with existing storage layer
export async function createThemeWithSupabase(themeData: any, userId?: string) {
  // Create theme in database
  const theme = await storage.createTheme(themeData);
  
  // If user is authenticated, you can add RLS policies
  if (userId) {
    // You can implement additional Supabase-specific logic here
    console.log(`Theme created by user: ${userId}`);
  }
  
  return theme;
} 