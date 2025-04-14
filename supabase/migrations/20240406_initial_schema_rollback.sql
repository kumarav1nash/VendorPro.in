-- Rollback script for initial schema

-- Drop triggers
DROP TRIGGER IF EXISTS update_sales_updated_at ON sales;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_shops_updated_at ON shops;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop policies
DROP POLICY IF EXISTS "Users can view sale items they have access to" ON sale_items;
DROP POLICY IF EXISTS "Sales reps can create sales" ON sales;
DROP POLICY IF EXISTS "Users can view sales they're involved with" ON sales;
DROP POLICY IF EXISTS "Shop owners can manage their shop's products" ON products;
DROP POLICY IF EXISTS "Shop owners can view their shop's products" ON products;
DROP POLICY IF EXISTS "Shop owners can update their own shops" ON shops;
DROP POLICY IF EXISTS "Shop owners can create shops" ON shops;
DROP POLICY IF EXISTS "Shop owners can view their own shops" ON shops;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Drop RLS
ALTER TABLE sale_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE shops DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop tables
DROP TABLE IF EXISTS sale_items;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS shops;
DROP TABLE IF EXISTS profiles;

-- Drop types
DROP TYPE IF EXISTS sale_status;
DROP TYPE IF EXISTS product_status;
DROP TYPE IF EXISTS user_role; 