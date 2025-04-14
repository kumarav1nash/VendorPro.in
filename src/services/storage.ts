import { DummyUser, DummyShop, DummyProduct, DummySale, DummySaleItem, DummyCommissionRule } from '../types/dummy';

interface StorageData {
  users: DummyUser[];
  shops: DummyShop[];
  products: DummyProduct[];
  sales: DummySale[];
  saleItems: DummySaleItem[];
  commissionRules: DummyCommissionRule[];
  commissions: {
    sale_id: string;
    amount: number;
    rate: number;
    status: string;
    created_at: string;
    updated_at: string;
  }[];
}

// Dummy data
const initialUsers: DummyUser[] = [
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
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    password: 'sales123',
  },
];

const initialShops: DummyShop[] = [
  {
    id: '1',
    name: 'Shop 1',
    owner_id: '2',
    address: '123 Main St',
    phone: '2345678901',
    email: 'shop1@example.com',
    gst_number: 'GST123456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    shop_salesmen: ['3'],
  },
  {
    id: '2',
    name: 'Shop 2',
    owner_id: '2',
    address: '456 Market St',
    phone: '2345678902',
    email: 'shop2@example.com',
    gst_number: 'GST789012',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    shop_salesmen: ['4'],
  },
];

class StorageService {
  private readonly STORAGE_KEY = 'vendorsInData';
  private data: StorageData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): StorageData {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return {
      users: initialUsers,
      shops: initialShops,
      products: [],
      sales: [],
      saleItems: [],
      commissionRules: [],
      commissions: [],
    };
  }

  private saveData() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  }

  // Users
  getUsers(): DummyUser[] {
    return this.data.users;
  }

  getUser(id: string): DummyUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  createUser(user: Omit<DummyUser, 'id'>): DummyUser {
    const newUser: DummyUser = {
      ...user,
      id: (this.data.users.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  updateUser(id: string, updates: Partial<DummyUser>): DummyUser | undefined {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;

    const updatedUser = {
      ...this.data.users[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.data.users[index] = updatedUser;
    this.saveData();
    return updatedUser;
  }

  // Shops
  getShops(): DummyShop[] {
    return this.data.shops;
  }

  getShop(id: string): DummyShop | undefined {
    return this.data.shops.find(s => s.id === id);
  }

  createShop(shop: Omit<DummyShop, 'id'>): DummyShop {
    const newShop: DummyShop = {
      ...shop,
      id: (this.data.shops.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.shops.push(newShop);
    this.saveData();
    return newShop;
  }

  updateShop(id: string, updates: Partial<DummyShop>): DummyShop | undefined {
    const index = this.data.shops.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    const updatedShop = {
      ...this.data.shops[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.data.shops[index] = updatedShop;
    this.saveData();
    return updatedShop;
  }

  // Products
  getProducts(shopId: string): DummyProduct[] {
    return this.data.products.filter(p => p.shop_id === shopId);
  }

  getProduct(id: string): DummyProduct | undefined {
    return this.data.products.find(p => p.id === id);
  }

  createProduct(product: Omit<DummyProduct, 'id'>): DummyProduct {
    const newProduct: DummyProduct = {
      ...product,
      id: (this.data.products.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.products.push(newProduct);
    this.saveData();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<DummyProduct>): DummyProduct | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    const updatedProduct = {
      ...this.data.products[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.data.products[index] = updatedProduct;
    this.saveData();
    return updatedProduct;
  }

  deleteProduct(id: string): void {
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.saveData();
  }

  // Sales
  getSales(shopId: string): DummySale[] {
    return this.data.sales.filter(s => s.shop_id === shopId);
  }

  getSale(id: string): DummySale | undefined {
    return this.data.sales.find(s => s.id === id);
  }

  createSale(sale: Omit<DummySale, 'id'>): DummySale {
    const newSale: DummySale = {
      ...sale,
      id: (this.data.sales.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.sales.push(newSale);
    this.saveData();
    return newSale;
  }

  updateSale(id: string, updates: Partial<DummySale>): DummySale | undefined {
    const index = this.data.sales.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    const updatedSale = {
      ...this.data.sales[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.data.sales[index] = updatedSale;
    this.saveData();
    return updatedSale;
  }

  // Sale Items
  getSaleItems(saleId: string): DummySaleItem[] {
    return this.data.saleItems.filter(i => i.sale_id === saleId);
  }

  createSaleItem(item: Omit<DummySaleItem, 'id'>): DummySaleItem {
    const newItem: DummySaleItem = {
      ...item,
      id: (this.data.saleItems.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.saleItems.push(newItem);
    this.saveData();
    return newItem;
  }

  // Commission Rules
  getCommissionRules(): DummyCommissionRule[] {
    return this.data.commissionRules;
  }

  createCommissionRule(rule: Omit<DummyCommissionRule, 'id'>): DummyCommissionRule {
    const newRule: DummyCommissionRule = {
      ...rule,
      id: (this.data.commissionRules.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.commissionRules.push(newRule);
    this.saveData();
    return newRule;
  }

  updateCommissionRule(id: string, updates: Partial<DummyCommissionRule>): DummyCommissionRule | undefined {
    const index = this.data.commissionRules.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    const updatedRule = {
      ...this.data.commissionRules[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.data.commissionRules[index] = updatedRule;
    this.saveData();
    return updatedRule;
  }

  // Commissions
  getCommission(saleId: string) {
    return this.data.commissions.find(c => c.sale_id === saleId);
  }

  createCommission(commission: { sale_id: string; amount: number; rate: number; status: string }) {
    if (!this.data.commissions) {
      this.data.commissions = [];
    }
    const newCommission = {
      ...commission,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.commissions.push(newCommission);
    this.saveData();
    return newCommission;
  }

  updateCommission(saleId: string, updates: Partial<StorageData['commissions'][0]>) {
    const index = this.data.commissions.findIndex(c => c.sale_id === saleId);
    if (index === -1) return undefined;

    const updatedCommission = {
      ...this.data.commissions[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.data.commissions[index] = updatedCommission;
    this.saveData();
    return updatedCommission;
  }
}

export const storageService = new StorageService(); 