import { DummyShop, DummyProduct, DummySale, DummySaleItem, DummyUser } from '../types/dummy';
import { storageService } from './storage';

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Dummy data
const dummyUsers: DummyUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '1234567890',
    role: 'admin',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    password: 'admin123',
  },
  {
    id: '2',
    name: 'Shop Owner 1',
    email: 'owner1@example.com',
    phone: '2345678901',
    role: 'shop_owner',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    password: 'owner123',
  },
  {
    id: '3',
    name: 'Salesman 1',
    email: 'salesman1@example.com',
    phone: '3456789012',
    role: 'salesman',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    password: 'sales123',
  },
  {
    id: '4',
    name: 'Salesman 2',
    email: 'salesman2@example.com',
    phone: '4567890123',
    role: 'salesman',
    status: 'inactive',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    password: 'sales123',
  },
];

const dummyShops: DummyShop[] = [
  {
    id: '1',
    name: 'Shop 1',
    owner_id: '2', // Shop Owner 1
    address: '123 Main St',
    phone: '2345678901',
    email: 'shop1@example.com',
    gst_number: 'GST123456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    shop_salesmen: ['3'], // Salesman 1 is assigned to Shop 1
  },
  {
    id: '2',
    name: 'Shop 2',
    owner_id: '2', // Shop Owner 1
    address: '456 Market St',
    phone: '2345678902',
    email: 'shop2@example.com',
    gst_number: 'GST789012',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    shop_salesmen: ['4'], // Salesman 2 is assigned to Shop 2
  },
];

const dummyProducts: DummyProduct[] = [
  {
    id: '1',
    shop_id: '1',
    name: 'Smartphone',
    description: 'Latest model smartphone',
    base_price: 500,
    selling_price: 600,
    quantity: 10,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const dummySales: DummySale[] = [
  {
    id: '1',
    shop_id: '1',
    salesman_id: '3',
    total_amount: 600,
    status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const dummySaleItems: DummySaleItem[] = [
  {
    id: '1',
    sale_id: '1',
    product_id: '1',
    quantity: 1,
    price: 600,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

class DummyDataService {
  // User methods
  async getUser(id: string): Promise<ServiceResponse<DummyUser>> {
    const user = storageService.getUser(id);
    return user 
      ? { success: true, data: user }
      : { success: false, error: 'User not found' };
  }

  async getUsers(): Promise<ServiceResponse<DummyUser[]>> {
    return { success: true, data: storageService.getUsers() };
  }

  // Shop methods
  async getShops(): Promise<ServiceResponse<DummyShop[]>> {
    return { success: true, data: storageService.getShops() };
  }

  async getShop(id: string): Promise<ServiceResponse<DummyShop>> {
    const shop = storageService.getShop(id);
    return shop 
      ? { success: true, data: shop }
      : { success: false, error: 'Shop not found' };
  }

  async createShop(shop: Omit<DummyShop, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceResponse<DummyShop>> {
    const newShop = storageService.createShop(shop);
    return { success: true, data: newShop };
  }

  async updateShop(id: string, data: Omit<DummyShop, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceResponse<DummyShop>> {
    const updatedShop = storageService.updateShop(id, data);
    return updatedShop 
      ? { success: true, data: updatedShop }
      : { success: false, error: 'Shop not found' };
  }

  // Product methods
  async getProducts(shopId: string): Promise<ServiceResponse<DummyProduct[]>> {
    return { success: true, data: storageService.getProducts(shopId) };
  }

  async getProduct(id: string): Promise<ServiceResponse<DummyProduct>> {
    const product = storageService.getProduct(id);
    return product 
      ? { success: true, data: product }
      : { success: false, error: 'Product not found' };
  }

  async createProduct(product: Omit<DummyProduct, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceResponse<DummyProduct>> {
    const newProduct = storageService.createProduct(product);
    return { success: true, data: newProduct };
  }

  async updateProduct(id: string, data: Partial<DummyProduct>): Promise<ServiceResponse<DummyProduct>> {
    const updatedProduct = storageService.updateProduct(id, data);
    return updatedProduct 
      ? { success: true, data: updatedProduct }
      : { success: false, error: 'Product not found' };
  }

  // Sale methods
  async getSales(shopId: string): Promise<ServiceResponse<DummySale[]>> {
    return { success: true, data: storageService.getSales(shopId) };
  }

  async getSale(id: string): Promise<ServiceResponse<DummySale>> {
    const sale = storageService.getSale(id);
    return sale 
      ? { success: true, data: sale }
      : { success: false, error: 'Sale not found' };
  }

  async createSale(sale: Omit<DummySale, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceResponse<DummySale>> {
    const newSale = storageService.createSale(sale);
    return { success: true, data: newSale };
  }

  async updateSale(id: string, data: Partial<DummySale>): Promise<ServiceResponse<DummySale>> {
    const updatedSale = storageService.updateSale(id, data);
    return updatedSale 
      ? { success: true, data: updatedSale }
      : { success: false, error: 'Sale not found' };
  }

  // Sale Item methods
  async getSaleItems(saleId: string): Promise<ServiceResponse<DummySaleItem[]>> {
    return { success: true, data: storageService.getSaleItems(saleId) };
  }

  async createSaleItem(item: Omit<DummySaleItem, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceResponse<DummySaleItem>> {
    const newItem = storageService.createSaleItem(item);
    return { success: true, data: newItem };
  }
}

export const dummyDataService = new DummyDataService(); 