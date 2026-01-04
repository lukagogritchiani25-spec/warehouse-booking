import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserDto, LoginRequest, RegisterRequest } from '../types/auth';
import { authApi } from '../services/api';

interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  updateProfile: (profileData: { phoneNumber?: string; address?: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user and token from localStorage on mount
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);

    if (response.success && response.data) {
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const register = async (userData: RegisterRequest) => {
    const response = await authApi.register(userData);

    if (!response.success) {
      throw new Error(response.message || 'Registration failed');
    }
    // Don't auto-login on registration - user needs to confirm email first
  };

  const googleLogin = async (idToken: string) => {
    const response = await authApi.googleLogin(idToken);

    if (response.success && response.data) {
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } else {
      throw new Error(response.message || 'Google login failed');
    }
  };

  const updateProfile = async (profileData: { phoneNumber?: string; address?: string }) => {
    const response = await authApi.updateProfile(profileData);

    if (response.success && response.data) {
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } else {
      throw new Error(response.message || 'Failed to update profile');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        register,
        googleLogin,
        updateProfile,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
