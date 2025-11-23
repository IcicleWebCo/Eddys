import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserRole {
  id: string;
  user_id: string;
  role: 'basic_user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface CompanyProfile {
  id: string;
  phone_number?: string;
  email?: string;
  hours_of_operation?: any;
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  seq?: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  created_at: string;
}
export interface MenuItem {
  id: string;
  category_id?: string;
  name: string;
  description?: string;
  price?: number;
  sequential?: number;
  created_at: string;
  updated_at: string;
}

export interface ItemOptions {
  id: string;
  menu_item_id?: string;
  name: string;
  price?: number;
  description?: string;
  seq?: number;
  created_at: string;
  updated_at: string;
}