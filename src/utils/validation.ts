/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (Indian format)
 */
export const isValidPhone = (phone: string): boolean => {
  // Indian phone number format: +91 followed by 10 digits
  const phoneRegex = /^\+91[0-9]{10}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate password strength
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const isStrongPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate OTP format (6 digits)
 */
export const isValidOTP = (otp: string): boolean => {
  const otpRegex = /^[0-9]{6}$/;
  return otpRegex.test(otp);
};

/**
 * Get password strength feedback
 */
export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string;
} => {
  let score = 0;
  let feedback = '';

  // Check length
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback = 'Password should be at least 8 characters long';
    return { score, feedback };
  }

  // Check for uppercase letter
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback = 'Add at least one uppercase letter';
    return { score, feedback };
  }

  // Check for lowercase letter
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback = 'Add at least one lowercase letter';
    return { score, feedback };
  }

  // Check for number
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback = 'Add at least one number';
    return { score, feedback };
  }

  // Check for special character
  if (/[@$!%*?&]/.test(password)) {
    score += 1;
  } else {
    feedback = 'Add at least one special character (@$!%*?&)';
    return { score, feedback };
  }

  // All checks passed
  feedback = 'Strong password';
  return { score, feedback };
};

/**
 * Format phone number to Indian format
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If the number starts with 91, remove it
  if (digits.startsWith('91')) {
    return `+91${digits.slice(2)}`;
  }
  
  // If the number starts with 0, remove it
  if (digits.startsWith('0')) {
    return `+91${digits.slice(1)}`;
  }
  
  // If the number is 10 digits, add +91
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  
  // If the number is already in the correct format, return it
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  
  // If none of the above, return the original number
  return phone;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

export const validateGSTIN = (gstin: string): boolean => {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
}; 