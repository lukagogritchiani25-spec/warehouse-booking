import axios from 'axios';
import type { ApiResponse, WarehouseDto, WarehouseUnitDto } from '../types/warehouse';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';
import type { BookingDto, CreateBookingRequest } from '../types/booking';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Warehouse API
export const warehouseApi = {
  getAllWarehouses: async (location?: string, isActive?: boolean) => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (isActive !== undefined) params.append('isActive', String(isActive));

    const { data } = await apiClient.get<ApiResponse<WarehouseDto[]>>(
      `/warehouses?${params.toString()}`
    );
    return data;
  },

  getWarehouseById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<WarehouseDto>>(
      `/warehouses/${id}`
    );
    return data;
  },

  getAvailableUnits: async (warehouseId: string) => {
    const { data } = await apiClient.get<ApiResponse<WarehouseUnitDto[]>>(
      `/warehouses/${warehouseId}/available-units`
    );
    return data;
  },
};

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    return data;
  },

  register: async (userData: RegisterRequest) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      userData
    );
    return data;
  },
};

// Booking API
export const bookingApi = {
  createBooking: async (bookingData: CreateBookingRequest) => {
    const { data } = await apiClient.post<ApiResponse<BookingDto>>(
      '/bookings',
      bookingData
    );
    return data;
  },

  getMyBookings: async () => {
    const { data } = await apiClient.get<ApiResponse<BookingDto[]>>('/bookings');
    return data;
  },

  getBookingById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<BookingDto>>(`/bookings/${id}`);
    return data;
  },

  cancelBooking: async (id: string) => {
    const { data } = await apiClient.post<ApiResponse<boolean>>(
      `/bookings/${id}/cancel`
    );
    return data;
  },
};

export default apiClient;
