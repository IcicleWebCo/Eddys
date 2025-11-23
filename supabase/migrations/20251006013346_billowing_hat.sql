/*
  # Fix User Roles RLS Policies

  1. Security Changes
    - Remove recursive admin policy that causes infinite loop
    - Simplify policies to prevent circular dependencies
    - Keep basic user access for reading own role
    - Allow system to insert roles during signup
*/

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can read all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update all roles" ON user_roles;

-- Keep the safe policies that don't cause recursion
-- Users can read their own role (this is safe and doesn't cause recursion)
-- System can insert roles (needed for signup trigger)

-- Note: Admin functionality can be handled at the application level
-- or through service role key for administrative operations