import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import styled from 'styled-components';
import { 
  Container, 
  Card, 
  Title, 
  Text, 
  Button, 
  Input, 
  FormGroup, 
  Label, 
  ErrorText,
} from '../components/styled/Common';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();

  const { login, isLoggingIn, loginError } = useAuth();
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/tasks');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <LoginContainer>
      <Container>
        <LoginCard>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Title style={{ marginBottom: '0.5rem' }}>Sign in to your account</Title>
            <Text>
              Or{' '}
              <LinkText to="/register">
                create a new account
              </LinkText>
            </Text>
          </div>

          <form onSubmit={handleSubmit}>
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
            </FormGroup>

            {loginError && (
              <ErrorText style={{ textAlign: 'center', marginBottom: '1rem' }}>
                {loginError.response?.data?.message || 'Login failed'}
              </ErrorText>
            )}

            <Button
              type="submit"
              disabled={isLoggingIn}
              style={{ width: '100%' }}
            >
              {isLoggingIn ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
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

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
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