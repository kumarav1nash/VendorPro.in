export interface DummyUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'shop_owner' | 'salesman';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  password?: string; // Optional for demo purposes only
}

export interface DummyShop {
  id: string;
  name: string;
  owner_id: string;
  address: string;
  phone: string;
  email: string;
  gst_number: string;
  created_at: string;
  updated_at: string;
}

export interface DummyProduct {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  base_price: number;
  selling_price: number;
  quantity: number;
  status: 'active' | 'inactive';
  image?: string; // URL or base64 string of the product image
  created_at: string;
  updated_at: string;
}

export interface DummySale {
  id: string;
  shop_id: string;
  salesman_id: string;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface DummySaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
} 