import { AuthResponse, OTPRequestResponse, OTPVerifyResponse, RegisterResponse } from '../types';
import { DummyUser } from '../types/dummy';
import { dummyDataService } from './dummyDataService';

interface AuthResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// Session storage key
const SESSION_STORAGE_KEY = 'vendorsInSession';

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // Sign in with email/password
  async signInWithPassword(email: string, password: string): Promise<AuthResponse<{ user: Omit<DummyUser, 'password'> }>> {
    await delay(500);
    
    // Get all users from dummyData service
    const usersResponse = await dummyDataService.getUsers();
    if (!usersResponse.success || !usersResponse.data) {
      return { success: false, error: 'Failed to load users' };
    }

    const user = usersResponse.data.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const { password: _, ...userWithoutPassword } = user;
    const session = { user: userWithoutPassword };
    
    // Store session in localStorage
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    
    return { success: true, data: { user: userWithoutPassword } };
  },

  // Sign in with OTP (dummy implementation)
  async signInWithOtp(email: string): Promise<AuthResponse> {
    await delay(500);
    const usersResponse = await dummyDataService.getUsers();
    if (!usersResponse.success || !usersResponse.data) {
      return { success: false, error: 'Failed to load users' };
    }

    const user = usersResponse.data.find(u => u.email === email);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // In a real implementation, this would send an OTP to the user's email
    console.log('OTP sent to', email);
    return { success: true };
  },

  // Verify OTP (dummy implementation)
  async verifyOtp(email: string, token: string): Promise<AuthResponse<{ user: Omit<DummyUser, 'password'> }>> {
    await delay(500);
    const usersResponse = await dummyDataService.getUsers();
    if (!usersResponse.success || !usersResponse.data) {
      return { success: false, error: 'Failed to load users' };
    }

    const user = usersResponse.data.find(u => u.email === email);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // In a real implementation, this would verify the OTP
    // For testing, we'll accept any 6-digit token
    if (!/^\d{6}$/.test(token)) {
      return { success: false, error: 'Invalid OTP' };
    }

    const { password: _, ...userWithoutPassword } = user;
    const session = { user: userWithoutPassword };
    
    // Store session in localStorage
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    
    return { success: true, data: { user: userWithoutPassword } };
  },

  // Sign out
  async signOut(): Promise<AuthResponse> {
    await delay(500);
    // Clear session from localStorage
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return { success: true };
  },

  // Get current session
  async getSession(): Promise<{ user: Omit<DummyUser, 'password'> } | null> {
    await delay(500);
    const sessionStr = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionStr) return null;
    
    try {
      return JSON.parse(sessionStr);
    } catch (error) {
      console.error('Error parsing session:', error);
      return null;
    }
  },

  // Get current user
  async getUser(): Promise<Omit<DummyUser, 'password'> | null> {
    await delay(500);
    const session = await this.getSession();
    return session?.user || null;
  },

  // Refresh session (dummy implementation)
  async refreshSession() {
    const session = await this.getSession();
    if (!session) {
      return { success: false, error: 'No active session' };
    }
    return { success: true, data: session };
  }
};

/**
 * Register a new user
 */
export const registerUser = async (
  email: string,
  password: string,
  userData: { name: string; phone?: string }
): Promise<RegisterResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) {
      return { success: false, error: handleSupabaseError(error).message };
    }

    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: 'Failed to register. Please try again.' };
  }
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: handleSupabaseError(error).message };
    }

    // Clear session storage
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to logout. Please try again.' };
  }
};

/**
 * Get the current user session
 */
export const getCurrentSession = async (): Promise<AuthResponse> => {
  try {
    // First check local storage
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (storedSession) {
      const session = JSON.parse(storedSession);
      // Check if session is expired
      if (session.expires_at && session.expires_at * 1000 > Date.now()) {
        return { success: true, data: session };
      }
    }

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return { success: false, error: handleSupabaseError(error).message };
    }

    // Store session if remember me is enabled
    if (data.session) {
      const isRememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
      if (isRememberMe) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.session));
      } else {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.session));
      }
    }

    return { success: true, data: data.session };
  } catch (error) {
    return { success: false, error: 'Failed to get session. Please try again.' };
  }
};

/**
 * Get the current user
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return { success: false, error: handleSupabaseError(error).message };
    }

    return { success: true, data: data.user };
  } catch (error) {
    return { success: false, error: 'Failed to get user. Please try again.' };
  }
};

/**
 * Refresh the current session
 */
export const refreshSession = async (): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      return { success: false, error: handleSupabaseError(error).message };
    }

    // Update stored session
    if (data.session) {
      const isRememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
      if (isRememberMe) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.session));
      } else {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.session));
      }
    }

    return { success: true, data: data.session };
  } catch (error) {
    return { success: false, error: 'Failed to refresh session. Please try again.' };
  }
}; 