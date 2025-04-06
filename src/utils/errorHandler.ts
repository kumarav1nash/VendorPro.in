import { PostgrestError } from '@supabase/supabase-js';

export class SupabaseError extends Error {
  constructor(
    message: string,
    public originalError: PostgrestError | Error | null = null,
    public code?: string
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export const handleSupabaseError = (error: PostgrestError | Error | null): SupabaseError => {
  if (!error) {
    return new SupabaseError('An unknown error occurred');
  }

  if ('code' in error && typeof error.code === 'string') {
    switch (error.code) {
      case '23505':
        return new SupabaseError('This record already exists', error, error.code);
      case '23503':
        return new SupabaseError('Referenced record does not exist', error, error.code);
      case '42P01':
        return new SupabaseError('Table does not exist', error, error.code);
      case 'P0001':
        return new SupabaseError('Custom error thrown by database', error, error.code);
      default:
        return new SupabaseError(
          'A database error occurred',
          error,
          error.code
        );
    }
  }

  // Auth errors
  if (error.message.includes('Invalid login credentials')) {
    return new SupabaseError('Invalid email or password', error);
  }

  if (error.message.includes('Email not confirmed')) {
    return new SupabaseError('Please verify your email address', error);
  }

  if (error.message.includes('Rate limit exceeded')) {
    return new SupabaseError('Too many attempts. Please try again later', error);
  }

  return new SupabaseError(error.message, error);
};

export const formatErrorMessage = (error: SupabaseError): string => {
  const baseMessage = error.message;
  
  if (process.env.NODE_ENV === 'development' && error.originalError) {
    return `${baseMessage}\n\nDetails: ${error.originalError.message}`;
  }

  return baseMessage;
}; 