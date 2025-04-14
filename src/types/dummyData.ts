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