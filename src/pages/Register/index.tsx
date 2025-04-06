import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isValidEmail, isStrongPassword } from '../../utils/validation';
import { Toast, Button, Input, Card, CardHeader, CardBody, CardFooter } from '../../components/ui';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate inputs
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!isStrongPassword(password)) {
      setError('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await register(email, password, { name, phone });
      if (response.success) {
        setSuccess('Registration successful! Please check your email to verify your account.');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.error || 'Failed to register');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
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
          
          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="space-y-4">
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              
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
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone Number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
              
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              fullWidth
            >
              Create Account
            </Button>
          </form>
        </CardBody>
        
        <CardFooter>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              className="font-medium text-primary-600 hover:text-primary-500"
              onClick={() => navigate('/login')}
            >
              Sign in here
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register; 