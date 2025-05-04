import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { authApi, favoritesApi } from '../authApi';

// Mock axios module
vi.mock('axios', () => ({
  default: {
    create: vi.fn().mockReturnValue({
      post: vi.fn(),
      get: vi.fn(),
    }),
  }
}));

describe('Auth API Service', () => {
  let mockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosInstance = axios.create();
  });

  describe('authApi', () => {
    it('should call register endpoint with correct data', async () => {
      const userData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { user: userData } });
      
      await authApi.register(userData);
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/register', userData);
    });

    it('should call login endpoint with correct data', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { user: { name: 'Test User' } } });
      
      await authApi.login(loginData);
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', loginData);
    });

    it('should call logout endpoint', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { success: true } });
      
      await authApi.logout();
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('should call me endpoint to get current user', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: { user: { name: 'Test User' } } });
      
      await authApi.me();
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/auth/me');
    });

    it('should properly handle errors in API calls', async () => {
      const error = new Error('Network Error');
      mockAxiosInstance.post.mockRejectedValueOnce(error);
      
      await expect(authApi.login({ email: 'test@example.com', password: 'wrong' }))
        .rejects
        .toThrow('Network Error');
    });
  });

  describe('favoritesApi', () => {
    it('should call get favorites endpoint', async () => {
      const mockFavorites = [{ code: 'USA' }, { code: 'CAN' }];
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockFavorites });
      
      await favoritesApi.get();
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/favorites');
    });

    it('should call add favorites endpoint with country code', async () => {
      const countryCode = 'FRA';
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { success: true } });
      
      await favoritesApi.add(countryCode);
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/favorites/add', { countryCode });
    });

    it('should call remove favorites endpoint with country code', async () => {
      const countryCode = 'DEU';
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { success: true } });
      
      await favoritesApi.remove(countryCode);
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/favorites/remove', { countryCode });
    });
  });
});