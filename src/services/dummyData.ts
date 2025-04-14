import { DummyShop, DummyProduct, DummySale, DummySaleItem, DummyUser } from '../types/dummy';

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
  },
];

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
  // User methods
  async getUser(id: string): Promise<ServiceResponse<DummyUser>> {
    const user = dummyUsers.find(u => u.id === id);
    return user 
      ? { success: true, data: user }
      : { success: false, error: 'User not found' };
  }

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

  async updateShop(id: string, data: Omit<DummyShop, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceResponse<DummyShop>> {
    const shopIndex = dummyShops.findIndex(shop => shop.id === id);
    if (shopIndex === -1) {
      return { success: false, error: 'Shop not found' };
    }

    const updatedShop: DummyShop = {
      ...dummyShops[shopIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };

    dummyShops[shopIndex] = updatedShop;
    return { success: true, data: updatedShop };
  }

  // Product methods
  async getProducts(shopId: string): Promise<ServiceResponse<DummyProduct[]>> {
    const products = dummyProducts.filter(p => p.shop_id === shopId);
    return { success: true, data: products };
  }

  async createProduct(formData: FormData): Promise<ServiceResponse<DummyProduct>> {
    let imageBase64: string | undefined;
    const imageFile = formData.get('image') as File;
    
    if (imageFile) {
      imageBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(imageFile);
      });
    }

    const productData: Omit<DummyProduct, 'id' | 'created_at' | 'updated_at'> = {
      shop_id: formData.get('shop_id') as string,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      base_price: Number(formData.get('base_price')),
      selling_price: Number(formData.get('selling_price')),
      quantity: Number(formData.get('quantity')),
      status: formData.get('status') as 'active' | 'inactive',
      image: imageBase64,
    };

    const newProduct: DummyProduct = {
      ...productData,
      id: (dummyProducts.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dummyProducts.push(newProduct);
    return { success: true, data: newProduct };
  }

  async updateProduct(id: string, formData: FormData): Promise<ServiceResponse<DummyProduct>> {
    const index = dummyProducts.findIndex(p => p.id === id);
    if (index === -1) {
      return { success: false, error: 'Product not found' };
    }
    
    let imageBase64: string | undefined;
    const imageFile = formData.get('image') as File;
    
    if (imageFile) {
      imageBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(imageFile);
      });
    }
    
    const updates: Partial<DummyProduct> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      base_price: Number(formData.get('base_price')),
      selling_price: Number(formData.get('selling_price')),
      quantity: Number(formData.get('quantity')),
      status: formData.get('status') as 'active' | 'inactive',
      image: imageBase64,
    };
    
    dummyProducts[index] = {
      ...dummyProducts[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return { success: true, data: dummyProducts[index] };
  }

  async deleteProduct(id: string): Promise<ServiceResponse<void>> {
    const index = dummyProducts.findIndex(p => p.id === id);
    if (index === -1) {
      return { success: false, error: 'Product not found' };
    }
    
    dummyProducts.splice(index, 1);
    return { success: true };
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

  async createUser(user: Omit<DummyUser, 'id'>): Promise<ServiceResponse<DummyUser>> {
    const newUser: DummyUser = {
      ...user,
      id: (dummyUsers.length + 1).toString(),
    };
    dummyUsers.push(newUser);
    return { success: true, data: newUser };
  }

  async getSalesmen(shopId: string): Promise<ServiceResponse<DummyUser[]>> {
    const salesmen = dummyUsers.filter(u => u.role === 'salesman');
    return { success: true, data: salesmen };
  }
}

export const dummyDataService = new DummyDataService(); 