import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DummyUser } from '../types/dummy';
import { authService } from '../services/auth';

// Define a type for user without password
type UserWithoutPassword = Omit<DummyUser, 'password'>;

interface AuthContextType {
  user: UserWithoutPassword | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signInWithOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserWithoutPassword | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await authService.getSession();
        if (session) {
          const user = await authService.getUser();
          if (user) {
            setUser(user);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signInWithPassword = async (email: string, password: string) => {
    const response = await authService.signInWithPassword(email, password);
    if (!response.success || !response.data?.user) {
      throw new Error(response.error || 'Failed to sign in');
    }
    setUser(response.data.user);
  };

  const signInWithOtp = async (email: string) => {
    const response = await authService.signInWithOtp(email);
    if (!response.success) {
      throw new Error(response.error || 'Failed to send OTP');
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    const response = await authService.verifyOtp(email, token);
    if (!response.success || !response.data?.user) {
      throw new Error(response.error || 'Failed to verify OTP');
    }
    setUser(response.data.user);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    signInWithPassword,
    signInWithOtp,
    verifyOtp,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 