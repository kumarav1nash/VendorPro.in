export interface DummyProduct {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  base_price: number;
  selling_price: number;
  quantity: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
} 