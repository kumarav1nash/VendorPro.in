import { DummyShop, DummyProduct, DummySale, DummySaleItem } from '../types/dummy';

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Dummy data
const dummyShops: DummyShop[] = [
  {
    id: '1',
    name: 'Electronics Store',
    owner_id: '1',
    address: '123 Tech Street',
    phone: '+1234567890',
    email: 'electronics@example.com',
    gst_number: 'GST123456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    salesman_id: '2',
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
  // Shop methods
  async getShops(): Promise<ServiceResponse<DummyShop[]>> {
    return { success: true, data: dummyShops };
  }

  async getShop(id: string): Promise<ServiceResponse<DummyShop>> {
    const shop = dummyShops.find(s => s.id === id);
    return shop 
      ? { success: true, data: shop }
      : { success: false, error: 'Shop not found' };
  }

  async createShop(shop: Omit<DummyShop, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceResponse<DummyShop>> {
    const newShop: DummyShop = {
      ...shop,
      id: (dummyShops.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dummyShops.push(newShop);
    return { success: true, data: newShop };
  }

  // Product methods
  async getProducts(shopId: string): Promise<ServiceResponse<DummyProduct[]>> {
    const products = dummyProducts.filter(p => p.shop_id === shopId);
    return { success: true, data: products };
  }

  async createProduct(product: Omit<DummyProduct, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceResponse<DummyProduct>> {
    const newProduct: DummyProduct = {
      ...product,
      id: (dummyProducts.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dummyProducts.push(newProduct);
    return { success: true, data: newProduct };
  }

  async updateProduct(id: string, updates: Partial<DummyProduct>): Promise<ServiceResponse<DummyProduct>> {
    const index = dummyProducts.findIndex(p => p.id === id);
    if (index === -1) {
      return { success: false, error: 'Product not found' };
    }
    
    dummyProducts[index] = {
      ...dummyProducts[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return { success: true, data: dummyProducts[index] };
  }

  // Sale methods
  async getSales(shopId: string): Promise<ServiceResponse<DummySale[]>> {
    const sales = dummySales.filter(s => s.shop_id === shopId);
    return { success: true, data: sales };
  }

  async createSale(sale: Omit<DummySale, 'id' | 'created_at' | 'updated_at'>, items: Omit<DummySaleItem, 'id' | 'sale_id' | 'created_at' | 'updated_at'>[]): Promise<ServiceResponse<DummySale>> {
    const newSale: DummySale = {
      ...sale,
      id: (dummySales.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dummySales.push(newSale);

    // Create sale items
    items.forEach(item => {
      const newSaleItem: DummySaleItem = {
        ...item,
        id: (dummySaleItems.length + 1).toString(),
        sale_id: newSale.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      dummySaleItems.push(newSaleItem);
    });

    return { success: true, data: newSale };
  }

  async getSaleItems(saleId: string): Promise<ServiceResponse<DummySaleItem[]>> {
    const items = dummySaleItems.filter(i => i.sale_id === saleId);
    return { success: true, data: items };
  }
}

export const dummyDataService = new DummyDataService(); 