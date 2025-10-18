import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import styled from 'styled-components';
import { 
  Container, 
  Card, 
  Text, 
  Button, 
  Input, 
  FormGroup, 
  Label, 
  ErrorText,
} from '../components/styled/Common';
import logo from '../assets/images/logo.webp';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  });

  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();

  // Set email from URL parameter if available
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setFormData(prev => ({
        ...prev,
        email: emailParam
      }));
    }
  }, [searchParams]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        
    try {
      await login(formData);
      navigate('/tasks');
    } catch (error) {
      console.error('Login failed:', error);
      
      // Handle error directly in handleSubmit
      // const errorMessage = error.response?.data?.message || 'Login failed';
      // const errorType = error.response?.data?.error_type;
      const raw = error?.response?.data;
      const errorType = raw?.error_type;
      const errorMessage = typeof raw?.message === 'string' ? raw.message : 'Login failed';

      console.log('Error type:', errorType);
      console.log('Error message:', errorMessage);
      
      if (errorType === 'email_not_found') {
        setFieldErrors({
          email: 'Email address does not exist',
          password: '',
        });
      } else if (errorType === 'invalid_password') {
        setFieldErrors({
          email: '',
          password: 'Please check your password',
        });
      } else {
        // Fallback to message-based detection
        if (errorMessage.toLowerCase().includes('email') || 
            errorMessage.toLowerCase().includes('user') ||
            errorMessage.toLowerCase().includes('account')) {
          setFieldErrors({
            email: errorMessage,
            password: '',
          });
        } else {
          setFieldErrors({
            email: '',
            password: errorMessage,
          });
        }
      }
    }
  };

  return (
    <LoginContainer>
      <Container>
        <LoginCard>
          <TopContainer>
            <img src={logo} alt="Logo" width={130} />
          </TopContainer>

          <form onSubmit={handleSubmit} noValidate>
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
              </InputContainer>
              {fieldErrors.email && (
                <ErrorText>{fieldErrors.email}</ErrorText>
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
                  autoComplete="current-password"
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
              {fieldErrors.password && (
                <ErrorText>{fieldErrors.password}</ErrorText>
              )}
            </FormGroup>

            <Button
              type="submit"
              disabled={isLoggingIn}
              style={{ width: '100%', height: '50px', marginTop: '1rem' }}
            >
              {isLoggingIn ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <LinkContainer>
              <Text size="0.7rem">
                Sign in to your account Or{' '}
                <LinkText to="/register">
                  create a new account
                </LinkText>
              </Text>
            </LinkContainer>
        </LoginCard>
      </Container>
    </LoginContainer>
  );
};

export default Login;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 2rem 1rem;
`;

const LoginCard = styled(Card)`
  max-width: 400px;
  width: 100%;
  padding: 2rem;
`;

const TopContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 0.5rem;
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
  padding: 1rem 2.5rem;
`;

const LinkText = styled(Link)`
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #4f46e5;
  }
`;