-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'vendor', 'customer');

-- Create enum for product status
CREATE TYPE product_status AS ENUM ('active', 'inactive', 'out_of_stock');

-- Create enum for sale status
CREATE TYPE sale_status AS ENUM ('pending', 'completed', 'cancelled');

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create shops table
CREATE TABLE shops (
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

-- Create products table
CREATE TABLE products (
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

-- Create sales table
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status sale_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create sale_items table (for line items in a sale)
CREATE TABLE sale_items (
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

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Shops policies
CREATE POLICY "Public shops are viewable by everyone"
    ON shops FOR SELECT
    USING (true);

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

CREATE POLICY "Vendors can update their own shops"
    ON shops FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Vendors can delete their own shops"
    ON shops FOR DELETE
    USING (auth.uid() = owner_id);

-- Products policies
CREATE POLICY "Public products are viewable by everyone"
    ON products FOR SELECT
    USING (true);

CREATE POLICY "Vendors can insert products in their shops"
    ON products FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM shops 
            WHERE id = shop_id 
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Vendors can update products in their shops"
    ON products FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM shops 
            WHERE id = shop_id 
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Vendors can delete products in their shops"
    ON products FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM shops 
            WHERE id = shop_id 
            AND owner_id = auth.uid()
        )
    );

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

CREATE POLICY "Customers can view their own sales"
    ON sales FOR SELECT
    USING (customer_id = auth.uid());

CREATE POLICY "Vendors can insert sales in their shops"
    ON sales FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM shops 
            WHERE id = shop_id 
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Vendors can update sales in their shops"
    ON sales FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM shops 
            WHERE id = shop_id 
            AND owner_id = auth.uid()
        )
    );

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

CREATE POLICY "Customers can view their own sale items"
    ON sale_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sales
            WHERE id = sale_id 
            AND customer_id = auth.uid()
        )
    );

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

-- Create functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_shops_updated_at
    BEFORE UPDATE ON shops
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
    BEFORE UPDATE ON sales
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_sale_items_updated_at
    BEFORE UPDATE ON sale_items
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column(); 