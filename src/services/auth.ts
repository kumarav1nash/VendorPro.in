import { supabase } from '../config/supabase';
import { handleSupabaseError } from '../utils/errorHandler';

export interface AuthResponse {
  success: boolean;
  data?: any;
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

export interface LoginResponse {
  success: boolean;
  session?: any;
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: any;
  error?: string;
}

/**
 * Request OTP for phone number
 */
export const requestOTP = async (phone: string): Promise<OTPRequestResponse> => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      return { success: false, error: handleSupabaseError(error).message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to send OTP. Please try again.' };
  }
};

/**
 * Verify OTP for phone number
 */
export const verifyOTP = async (phone: string, token: string): Promise<OTPVerifyResponse> => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (error) {
      return { success: false, error: handleSupabaseError(error).message };
    }

    return { success: true, session: data.session };
  } catch (error) {
    return { success: false, error: 'Failed to verify OTP. Please try again.' };
  }
};

/**
 * Login with email and password
 */
export const loginWithPassword = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: handleSupabaseError(error).message };
    }

    return { success: true, session: data.session };
  } catch (error) {
    return { success: false, error: 'Failed to login. Please try again.' };
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
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return { success: false, error: handleSupabaseError(error).message };
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

    return { success: true, data: data.session };
  } catch (error) {
    return { success: false, error: 'Failed to refresh session. Please try again.' };
  }
}; 