import { supabase } from '../config/supabase';
import { handleSupabaseError } from '../utils/errorHandler';
import { AuthResponse, OTPRequestResponse, OTPVerifyResponse, RegisterResponse } from '../types';

/**
 * Request OTP for phone number
 */
export const requestOTP = async (phone: string): Promise<OTPRequestResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error('Supabase OTP error:', error);
      
      // Handle specific Twilio error
      if (error.message.includes('not a valid message-capable Twilio phone number')) {
        return { 
          success: false, 
          error: 'SMS service is not properly configured. Please contact support or try email login instead.' 
        };
      }
      
      return { success: false, error: handleSupabaseError(error).message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in requestOTP:', error);
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
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Check for specific error cases
      if (error.message.includes('Invalid login credentials')) {
        // Try to sign up with the same email to check if user exists
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });

        // If we get a "User already registered" error, the user exists but password is wrong
        if (signUpError?.message.includes('User already registered')) {
          return { 
            success: false, 
            error: 'Incorrect password. Please try again.' 
          };
        }
        
        // If we get a different error or no error, the user doesn't exist
        return { 
          success: false, 
          error: 'No account found with this email. Please register first.' 
        };
      }
      return { success: false, error: handleSupabaseError(error).message };
    }

    return { success: true, session: data.session };
  } catch (error) {
    console.error('Login error:', error);
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