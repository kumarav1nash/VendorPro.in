import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentUser, 
  getCurrentSession, 
  refreshSession,
  loginWithPassword,
  requestOTP,
  verifyOTP,
  registerUser,
  logout
} from '../services/auth';
import { User, AuthResponse, OTPRequestResponse, OTPVerifyResponse, RegisterResponse } from '../types';

interface AuthContextType {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithPassword: (email: string, password: string) => Promise<AuthResponse>;
  loginWithOTP: (phone: string) => Promise<OTPRequestResponse>;
  verifyOTP: (phone: string, token: string) => Promise<OTPVerifyResponse>;
  register: (email: string, password: string, userData: { name: string; phone?: string }) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the hook as a named export
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Export the provider as a named export
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user && !!session;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const sessionResponse = await getCurrentSession();
        if (sessionResponse.success && sessionResponse.data) {
          setSession(sessionResponse.data);
          
          // Get user data
          const userResponse = await getCurrentUser();
          if (userResponse.success && userResponse.data) {
            setUser(userResponse.data);
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Set up session refresh interval
  useEffect(() => {
    if (!session) return;

    const refreshInterval = setInterval(async () => {
      try {
        const response = await refreshSession();
        if (response.success && response.data) {
          setSession(response.data);
        } else {
          // Session expired or invalid, log out
          await handleLogout();
        }
      } catch (error) {
        console.error('Failed to refresh session:', error);
        await handleLogout();
      }
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(refreshInterval);
  }, [session]);

  const handleLoginWithPassword = async (email: string, password: string) => {
    try {
      const response = await loginWithPassword(email, password);
      if (response.success && response.session) {
        setSession(response.session);
        const userResponse = await getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
        }
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: 'Failed to login. Please try again.' };
    }
  };

  const handleLoginWithOTP = async (phone: string) => {
    try {
      const response = await requestOTP(phone);
      if (!response.success) {
        return { success: false, error: response.error || 'Failed to send OTP' };
      }
      return { success: true };
    } catch (error) {
      console.error('Error in handleLoginWithOTP:', error);
      return { success: false, error: 'Failed to send OTP. Please try again.' };
    }
  };

  const handleVerifyOTP = async (phone: string, token: string) => {
    try {
      const response = await verifyOTP(phone, token);
      if (response.success && response.session) {
        setSession(response.session);
        const userResponse = await getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
        }
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: 'Failed to verify OTP. Please try again.' };
    }
  };

  const handleRegister = async (email: string, password: string, userData: { name: string; phone?: string }) => {
    try {
      const response = await registerUser(email, password, userData);
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: 'Failed to register. Please try again.' };
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setSession(null);
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated,
    loginWithPassword: handleLoginWithPassword,
    loginWithOTP: handleLoginWithOTP,
    verifyOTP: handleVerifyOTP,
    register: handleRegister,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 