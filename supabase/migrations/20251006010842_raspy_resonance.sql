/*
  # Create Restaurant Database Schema

  1. New Tables
    - `company_profile`
      - `id` (uuid, primary key)
      - `phone_number` (text)
      - `email` (text)
      - `hours_of_operation` (jsonb)
      - `facebook_url` (text)
      - `instagram_url` (text)
      - `tiktok_url` (text)
    - `category`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `description` (text)
      - `seq` (integer)
    - `menu_item`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key)
      - `name` (text, required)
      - `description` (text)
      - `price` (decimal)
      - `sequential` (integer)
    - `item_options`
      - `id` (uuid, primary key)
      - `menu_item_id` (uuid, foreign key)
      - `name` (text, required)
      - `price` (decimal, default 0.00)
      - `description` (text)
      - `seq` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (suitable for restaurant menu display)
    - Add policies for authenticated users to manage content
*/

-- Table for company contact & social info
CREATE TABLE IF NOT EXISTS company_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT,
  email TEXT,
  hours_of_operation JSONB,
  facebook_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table for menu categories (e.g., Pizza, Appetizers)
CREATE TABLE IF NOT EXISTS category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  seq INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table for individual menu items
CREATE TABLE IF NOT EXISTS menu_item (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES category(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  seq INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table for options on a menu item (e.g., Toppings, Sizes)
CREATE TABLE IF NOT EXISTS item_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES menu_item(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0.00,
  description TEXT,
  seq INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE company_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE category ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_options ENABLE ROW LEVEL SECURITY;

-- Policies for public read access (restaurant menu should be publicly viewable)
CREATE POLICY "Allow public read access to company_profile"
  ON company_profile
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to category"
  ON category
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to menu_item"
  ON menu_item
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to item_options"
  ON item_options
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policies for authenticated users to manage content
CREATE POLICY "Allow authenticated users to manage company_profile"
  ON company_profile
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage category"
  ON category
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage menu_item"
  ON menu_item
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage item_options"
  ON item_options
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_item_category_id ON menu_item(category_id);
CREATE INDEX IF NOT EXISTS idx_item_options_menu_item_id ON item_options(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_category_seq ON category(seq);
CREATE INDEX IF NOT EXISTS idx_menu_item_sequential ON menu_item(sequential);
CREATE INDEX IF NOT EXISTS idx_item_options_seq ON item_options(seq);