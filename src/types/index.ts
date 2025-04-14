// User types
export interface User {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    phone?: string;
  };
}

// Shop types
export interface Shop {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
  lastUpdated: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

// Sale types
export interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  shopId: string;
  shopName: string;
  date: string;
  amount: number;
  items: SaleItem[];
  status: 'completed' | 'pending' | 'cancelled';
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth types
export interface AuthResponse {
  success: boolean;
  data?: any;
  session?: any;
  error?: string;
}

export interface OTPRequestResponse {
  success: boolean;
  error?: string;
}

export interface OTPVerifyResponse {
  success: boolean;
  session?: any;
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: any;
  error?: string;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface OTPForm {
  phone: string;
  otp: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  name: string;
  phone?: string;
} 