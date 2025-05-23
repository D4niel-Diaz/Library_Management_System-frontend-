"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  profile_image?: string | null;
  created_at?: string;
}

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

interface AppContextType {
  authToken: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateUser: (userData: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  });
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshAuth = async () => {
    if (!authToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json'
        }
      });
      
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        throw new Error('No user data received');
      }
    } catch (error) {
      console.error('Failed to refresh auth:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setAuthToken(null);
      setUser(null);
      router.push('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (!authToken) {
        setIsLoading(false);
        return;
      }
      await refreshAuth();
    };
    initializeAuth();
  }, [authToken]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`, 
        { email, password },
        {
          headers: { Accept: 'application/json' },
          withCredentials: true
        }
      );
      
      if (response.data.access_token && response.data.user) {
        const token = response.data.access_token;
        const userData = response.data.user;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setAuthToken(token);
        setUser(userData);
        
        // Redirect based on role
        if (userData.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error('Login error:', axiosError);
      toast.error(axiosError.response?.data?.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string, role: string) => {
    setIsLoading(true);
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`, 
        { name, email, password, password_confirmation, role },
        {
          headers: { Accept: 'application/json' },
          withCredentials: true
        }
      );
      
      toast.success('Registration successful! Please login.');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error('Registration error:', axiosError);
      toast.error(axiosError.response?.data?.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // First attempt to logout from the server if we have a token
      if (authToken) {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, 
            {},
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: 'application/json'
              },
              withCredentials: true
            }
          );
        } catch (error) {
          // Log the error but continue with local logout
          console.log('Server logout failed:', error);
        }
      }

      // Clear local storage and state
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setAuthToken(null);
      setUser(null);
      
      // Set loading to false before redirect
      setIsLoading(false);
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Clear any pending requests
      axios.defaults.headers.common['Authorization'] = '';
      
      // Use setTimeout to ensure state updates are processed before redirect
      setTimeout(() => {
        // Force a hard redirect to auth page
        window.location.href = '/auth';
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, ensure we clear local state
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setAuthToken(null);
      setUser(null);
      
      // Clear any pending requests
      axios.defaults.headers.common['Authorization'] = '';
      
      // Set loading to false before redirect
      setIsLoading(false);
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Use setTimeout to ensure state updates are processed before redirect
      setTimeout(() => {
        // Force a hard redirect to auth page
        window.location.href = '/auth';
      }, 100);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AppContext.Provider value={{
      authToken,
      user,
      isLoading,
      login,
      register,
      logout,
      refreshAuth,
      updateUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
