import React, { useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isValidEmail, isValidPhone, formatPhoneNumber } from '../../utils/validation';
import { Toast, Button, Input, Card, CardHeader, CardBody, CardFooter } from '../../components/ui';

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<'otp' | 'password'>('otp');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | ReactNode | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithOTP, verifyOTP, loginWithPassword } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!isValidPhone(formattedPhone)) {
      setError('Please enter a valid Indian phone number');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await loginWithOTP(formattedPhone);
      if (response.success) {
        setOtpSent(true);
        setSuccess('OTP sent successfully');
      } else {
        setError(response.error || 'Failed to send OTP');
        
        // If SMS service is not configured, suggest email login
        if (response.error?.includes('SMS service is not properly configured')) {
          setError('SMS service is not available. Please use email login instead.');
          // Auto-switch to email login
          setLoginType('password');
        }
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate OTP
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const response = await verifyOTP(formattedPhone, otp);
      if (response.success) {
        setSuccess('Login successful');
        navigate(from, { replace: true });
      } else {
        setError(response.error || 'Failed to verify OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate email
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Validate password
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await loginWithPassword(email, password);
      if (response.success) {
        setSuccess('Login successful');
        navigate(from, { replace: true });
      } else {
        // Handle specific error cases
        if (response.error?.includes('No account found')) {
          setError(
            <div className="text-center">
              <p className="text-red-600 font-medium">No account found with this email.</p>
              <p className="text-sm text-gray-600 mt-1">Would you like to create one?</p>
              <button
                type="button"
                className="text-primary-600 hover:text-primary-500 font-medium mt-2"
                onClick={() => navigate('/register')}
              >
                Create an account
              </button>
            </div>
          );
        } else if (response.error?.includes('Incorrect password')) {
          setError(
            <div className="text-center">
              <p className="text-red-600 font-medium">Incorrect password.</p>
              <p className="text-sm text-gray-600 mt-1">Please check your password and try again.</p>
            </div>
          );
        } else if (response.error?.includes('verify your email')) {
          setError(
            <div className="text-center">
              <p className="text-red-600 font-medium">Please verify your email address.</p>
              <p className="text-sm text-gray-600 mt-1">Check your inbox for the verification link.</p>
            </div>
          );
        } else {
          setError(response.error || 'An error occurred during login');
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetOtpForm = () => {
    setOtpSent(false);
    setOtp('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </CardHeader>
        
        <CardBody>
          {error && (
            <Toast 
              message={error} 
              variant="error" 
              onClose={() => setError(null)} 
            />
          )}
          
          {success && (
            <Toast 
              message={success} 
              variant="success" 
              onClose={() => setSuccess(null)} 
            />
          )}
          
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              variant={loginType === 'otp' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
                setLoginType('otp');
                resetOtpForm();
              }}
            >
              OTP Login
            </Button>
            <Button
              variant={loginType === 'password' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setLoginType('password')}
            >
              Password Login
            </Button>
          </div>

          {loginType === 'otp' ? (
            <form className="space-y-6" onSubmit={otpSent ? handleOtpLogin : handleSendOtp}>
              <div className="space-y-4">
                <Input
                  id="phone-number"
                  name="phone"
                  type="tel"
                  required
                  placeholder="Phone Number (e.g., +91XXXXXXXXXX)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={otpSent}
                />
                {otpSent && (
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                )}
              </div>

              <div className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  fullWidth
                >
                  {otpSent ? 'Verify OTP' : 'Send OTP'}
                </Button>
                {otpSent && (
                  <Button
                    type="button"
                    variant="text"
                    onClick={resetOtpForm}
                  >
                    Change phone number
                  </Button>
                )}
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handlePasswordLogin}>
              <div className="space-y-4">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                fullWidth
              >
                Sign in with Password
              </Button>
            </form>
          )}
        </CardBody>
        
        <CardFooter>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              className="font-medium text-primary-600 hover:text-primary-500"
              onClick={() => navigate('/register')}
            >
              Register here
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login; 