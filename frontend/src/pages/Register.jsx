import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import api from '../services/api';
import { 
  Container, 
  Card, 
  Title, 
  Text, 
  Button, 
  Input, 
  FormGroup, 
  Label, 
  ErrorText
} from '../components/styled/Common';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showConfirmPasswordError, setShowConfirmPasswordError] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const { register, isRegistering, registerError } = useAuth();

  // Password validation function
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password)) {
      return 'Password must contain at least one letter and one special character';
    }
    return '';
  };

  // Email validation function
  const validateEmail = (email) => {
    if (!email || email.trim() === '') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check email availability
  const checkEmailAvailability = async (email) => {
    console.log('Checking email availability for:', email);
    
    if (!email || !validateEmail(email)) {
      console.log('Email validation failed or empty');
      setEmailError('');
      setShowEmailError(false);
      return;
    }
    
    setIsCheckingEmail(true);
    try {
      // Use the dedicated email check endpoint with api instance
      const response = await api.post('/check-email', {
        email: email
      });
      
      const data = response.data;
      
      if (data.available === false) {
        // Email is already taken
        setEmailError(data.message);
        setTimeout(() => setShowEmailError(true), 1000);
      } else {
        // Email is available
        setEmailError('');
        setShowEmailError(false);
      }
    } catch (error) {
      console.error('Email check failed:', error);
      setEmailError('');
      setShowEmailError(false);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'email') {
      setEmailError('');
      setShowEmailError(false);
      
      if (window.emailCheckTimeout) {
        clearTimeout(window.emailCheckTimeout);
      }
      
      window.emailCheckTimeout = setTimeout(() => {
        checkEmailAvailability(value);
      }, 500);
    }

    if (name === 'password') {
      const error = validatePassword(value);
      setPasswordError(error);
      
      if (error && value.length > 0) {
        setTimeout(() => setShowPasswordError(true), 1000);
      } else {
        setShowPasswordError(false);
      }
      
      if (formData.password_confirmation) {
        if (value !== formData.password_confirmation && value.length > 0) {
          setConfirmPasswordError('Passwords do not match');
          setTimeout(() => setShowConfirmPasswordError(true), 1000);
        } else {
          setConfirmPasswordError('');
          setShowConfirmPasswordError(false);
        }
      }
    }

    if (name === 'password_confirmation') {
      if (value !== formData.password) {
        setConfirmPasswordError('Passwords do not match');
        if (value.length > 0) {
          setTimeout(() => setShowConfirmPasswordError(true), 1000);
        }
      } else {
        setConfirmPasswordError('');
        setShowConfirmPasswordError(false);
      }
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.password_confirmation.trim() !== '' &&
      passwordError === '' &&
      confirmPasswordError === '' &&
      emailError === '' &&
      !isCheckingEmail &&
      formData.password === formData.password_confirmation
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation before submit
    if (!isFormValid()) {
      return;
    }

    try {
      await register(formData);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Handle register error
  React.useEffect(() => {
    if (registerError) {
      const emailErrorMsg = registerError.response?.data?.errors?.email?.[0];
      if (emailErrorMsg) {
        setEmailError(emailErrorMsg);
        setTimeout(() => setShowEmailError(true), 1000);
      }
    }
  }, [registerError]);

  return (
    <RegisterContainer>
      <Container>
        <RegisterCard>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Title style={{ marginBottom: '0.5rem' }}>Create your account</Title>
            <Text>
              Or{' '}
              <LinkText to="/login">
                sign in to your existing account
              </LinkText>
            </Text>
          </div>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Full name</Label>
              <InputContainer>
                <InputIcon>
                  <User size={20} />
                </InputIcon>
                <StyledInput
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </InputContainer>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email address</Label>
              <InputContainer>
                <InputIcon>
                  <Mail size={20} />
                </InputIcon>
                <StyledInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {isCheckingEmail && (
                  <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                    <Spinner />
                  </div>
                )}
              </InputContainer>
              {showEmailError && emailError && (
                <BounceErrorText>
                  {emailError}
                </BounceErrorText>
              )}
              {isCheckingEmail && (
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Checking email availability...
                </div>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <InputContainer>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <StyledInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </InputContainer>
              {passwordError && passwordError.trim() !== '' && showPasswordError && (
                <BounceErrorText>
                  {passwordError}
                </BounceErrorText>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <InputContainer>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <StyledInput
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="Confirm password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </InputContainer>
              {confirmPasswordError && confirmPasswordError.trim() !== '' && showConfirmPasswordError && (
                <BounceErrorText>
                  {confirmPasswordError}
                </BounceErrorText>
              )}
            </FormGroup>


            <Button
              type="submit"
              disabled={isRegistering || !isFormValid()}
              style={{ width: '100%' }}
            >
              {isRegistering ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </RegisterCard>
      </Container>
    </RegisterContainer>
  );
};

export default Register;

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 2rem 1rem;
`;

const RegisterCard = styled(Card)`
  max-width: 400px;
  width: 100%;
  padding: 2rem;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 0.4rem;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: #6b7280;
  }
`;

const StyledInput = styled(Input)`
  padding-left: 2.5rem;
  padding-right: 2.5rem;
`;

const LinkText = styled(Link)`
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #4f46e5;
  }
`;

const BounceErrorText = styled(ErrorText)`
  animation: bounceIn 0.6s ease-out;
  margin-top: 0.25rem;

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3) translateY(-10px);
    }
    50% {
      opacity: 1;
      transform: scale(1.05) translateY(0);
    }
    70% {
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #6366f1;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;