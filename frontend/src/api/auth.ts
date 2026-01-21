import apiService from './request';

export interface User {
  id: number;
  username: string;
  role: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    user: User;
    accessToken: string;
    refreshToken: string;
    isEnvAdmin?: boolean;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface UsersResponse {
  success: boolean;
  data?: {
    users: User[];
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface AuthResponse {
  success: boolean;
  data?: {
    accessToken?: string;
    user?: User;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Auth API
export const authApi = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await apiService.post('/api/auth/login', { username, password });
    return response as LoginResponse;
  },

  async logout(): Promise<AuthResponse> {
    const response = await apiService.post('/api/auth/logout', {});
    return response as AuthResponse;
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await apiService.post('/api/auth/refresh', { refreshToken });
    return response as AuthResponse;
  },

  async getMe(): Promise<AuthResponse> {
    const response = await apiService.get('/api/auth/me');
    return response as AuthResponse;
  },
};

// Admin API
export const adminApi = {
  async getUsers(accessToken: string): Promise<UsersResponse> {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.json() as Promise<UsersResponse>;
  },

  async createUser(
    accessToken: string,
    username: string,
    password: string,
    role: string = 'admin'
  ): Promise<ApiResponse<{ user: User }>> {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ username, password, role }),
    });
    return response.json() as Promise<ApiResponse<{ user: User }>>;
  },

  async deleteUser(accessToken: string, id: number): Promise<ApiResponse> {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.json() as Promise<ApiResponse>;
  },
};

// Helper to get API base URL (Vite proxy handles /api prefix)
export function getApiBaseUrl(): string {
  const apiPrefix = import.meta.env.VITE_API_PREFIX
  if (apiPrefix) {
    return apiPrefix
  }
  // Fallback to localhost for development
  if (import.meta.env.DEV) {
    return 'http://localhost:8787'
  }
  // Production fallback - should be set in environment variables
  return ''
}

export default {
  auth: authApi,
  admin: adminApi,
};
