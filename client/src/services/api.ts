const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Define specific types for nutritional info
interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  [key: string]: string | number | undefined;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  nutritionalInfo?: NutritionalInfo; // Fixed: No more 'any'
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  count: number;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options?.headers || {}),
      },
    };
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
  
  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
  
  async signup(email: string, password: string, name: string, phone?: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone }),
    });
  }
  
  // Product endpoints
  async getProducts(category?: string, search?: string): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    const queryString = params.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ProductsResponse>(endpoint);
  }
  
  async getProductById(id: number): Promise<{ success: boolean; data: Product }> {
    return this.request<{ success: boolean; data: Product }>(`/api/products/${id}`);
  }
  
  async getCategories(): Promise<{ success: boolean; data: string[] }> {
    return this.request<{ success: boolean; data: string[] }>('/api/products/categories');
  }
}

export const apiService = new ApiService();
