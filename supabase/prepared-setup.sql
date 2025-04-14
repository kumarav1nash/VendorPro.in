-- Statement 1
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Statement 2
-- Create enum types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'vendor', 'customer');

-- Statement 3
EXCEPTION
    WHEN duplicate_object THEN null;

-- Statement 4
END $$;

-- Statement 5
DO $$ BEGIN
    CREATE TYPE product_status AS ENUM ('active', 'inactive', 'out_of_stock');

-- Statement 6
EXCEPTION
    WHEN duplicate_object THEN null;

-- Statement 7
END $$;

-- Statement 8
DO $$ BEGIN
    CREATE TYPE sale_status AS ENUM ('pending', 'completed', 'cancelled');

-- Statement 9
EXCEPTION
    WHEN duplicate_object THEN null;

-- Statement 10
END $$;

-- Statement 11
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Statement 12
-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    gst_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(owner_id, name)
);

-- Statement 13
-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    status product_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(shop_id, name)
);

-- Statement 14
-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status sale_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Statement 15
-- Create sale_items table
CREATE TABLE IF NOT EXISTS sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(sale_id, product_id)
);

-- Statement 16
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Statement 17
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

-- Statement 18
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Statement 19
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Statement 20
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Statement 21
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Statement 22
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Statement 23
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Statement 24
DROP POLICY IF EXISTS "Public shops are viewable by everyone" ON shops;

-- Statement 25
DROP POLICY IF EXISTS "Vendors can insert their own shops" ON shops;

-- Statement 26
DROP POLICY IF EXISTS "Vendors can update their own shops" ON shops;

-- Statement 27
DROP POLICY IF EXISTS "Vendors can delete their own shops" ON shops;

-- Statement 28
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;

-- Statement 29
DROP POLICY IF EXISTS "Vendors can insert products in their shops" ON products;

-- Statement 30
DROP POLICY IF EXISTS "Vendors can update products in their shops" ON products;

-- Statement 31
DROP POLICY IF EXISTS "Vendors can delete products in their shops" ON products;

-- Statement 32
DROP POLICY IF EXISTS "Vendors can view sales in their shops" ON sales;

-- Statement 33
DROP POLICY IF EXISTS "Customers can view their own sales" ON sales;

-- Statement 34
DROP POLICY IF EXISTS "Vendors can insert sales in their shops" ON sales;

-- Statement 35
DROP POLICY IF EXISTS "Vendors can update sales in their shops" ON sales;

-- Statement 36
DROP POLICY IF EXISTS "Vendors can view sale items in their shops" ON sale_items;

-- Statement 37
DROP POLICY IF EXISTS "Customers can view their own sale items" ON sale_items;

-- Statement 38
DROP POLICY IF EXISTS "Vendors can insert sale items in their shops" ON sale_items;

-- Statement 39
DROP POLICY IF EXISTS "Vendors can update sale items in their shops" ON sale_items;

-- Statement 40
-- Create RLS policies

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

-- Statement 41
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Statement 42
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Statement 43
-- Shops policies
CREATE POLICY "Public shops are viewable by everyone"
    ON shops FOR SELECT
    USING (true);

-- Statement 44
CREATE POLICY "Vendors can insert their own shops"
    ON shops FOR INSERT
    WITH CHECK (
        auth.uid() = owner_id AND 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'vendor'
        )
    );

-- Statement 45
CREATE POLICY "Vendors can update their own shops"
    ON shops FOR UPDATE
    USING (auth.uid() = owner_id);

-- Statement 46
CREATE POLICY "Vendors can delete their own shops"
    ON shops FOR DELETE
    USING (auth.uid() = owner_id);

-- Statement 47
-- Products policies
CREATE POLICY "Public products are viewable by everyone"
    ON products FOR SELECT
    USING (true);

-- Statement 48
CREATE POLICY "Vendors can insert products in their shops"
    ON products FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM shops 
            WHERE id = shop_id 
            AND owner_id = auth.uid()
        )
    );

-- Statement 49
CREATE POLICY "Vendors can update products in their shops"
    ON products FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM shops 
            WHERE id = shop_id 
            AND owner_id = auth.uid()
        )
    );

-- Statement 50
CREATE POLICY "Vendors can delete products in their shops"
    ON products FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM shops 
            WHERE id = shop_id 
            AND owner_id = auth.uid()
        )
    );

-- Statement 51
-- Sales policies
CREATE POLICY "Vendors can view sales in their shops"
    ON sales FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM shops 
            WHERE id = shop_id 
            AND owner_id = auth.uid()
        )
    );

-- Statement 52
CREATE POLICY "Customers can view their own sales"
    ON sales FOR SELECT
    USING (customer_id = auth.uid());

-- Statement 53
CREATE POLICY "Vendors can insert sales in their shops"
    ON sales FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM shops 
            WHERE id = shop_id 
            AND owner_id = auth.uid()
        )
    );

-- Statement 54
CREATE POLICY "Vendors can update sales in their shops"
    ON sales FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM shops 
            WHERE id = shop_id 
            AND owner_id = auth.uid()
        )
    );

-- Statement 55
-- Sale items policies
CREATE POLICY "Vendors can view sale items in their shops"
    ON sale_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sales s
            JOIN shops sh ON s.shop_id = sh.id
            WHERE s.id = sale_id 
            AND sh.owner_id = auth.uid()
        )
    );

-- Statement 56
CREATE POLICY "Customers can view their own sale items"
    ON sale_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sales s
            WHERE s.id = sale_id 
            AND s.customer_id = auth.uid()
        )
    );

-- Statement 57
CREATE POLICY "Vendors can insert sale items in their shops"
    ON sale_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM sales s
            JOIN shops sh ON s.shop_id = sh.id
            WHERE s.id = sale_id 
            AND sh.owner_id = auth.uid()
        )
    );

-- Statement 58
CREATE POLICY "Vendors can update sale items in their shops"
    ON sale_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM sales s
            JOIN shops sh ON s.shop_id = sh.id
            WHERE s.id = sale_id 
            AND sh.owner_id = auth.uid()
        )
    );

-- Statement 59
-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());

-- Statement 60
RETURN NEW;

-- Statement 61
END;

-- Statement 62
$$ language 'plpgsql';

-- Statement 63
-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Statement 64
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Statement 65
DROP TRIGGER IF EXISTS update_shops_updated_at ON shops;

-- Statement 66
CREATE TRIGGER update_shops_updated_at
    BEFORE UPDATE ON shops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Statement 67
DROP TRIGGER IF EXISTS update_products_updated_at ON products;

-- Statement 68
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Statement 69
DROP TRIGGER IF EXISTS update_sales_updated_at ON sales;

-- Statement 70
CREATE TRIGGER update_sales_updated_at
    BEFORE UPDATE ON sales
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Statement 71
DROP TRIGGER IF EXISTS update_sale_items_updated_at ON sale_items;

-- Statement 72
CREATE TRIGGER update_sale_items_updated_at
    BEFORE UPDATE ON sale_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();