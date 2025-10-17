import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, Mail, User, Save, X } from 'lucide-react';
import styled from 'styled-components';
import { 
  PageContainer, 
  Card, 
  Title, 
  Text, 
  Button, 
  Input,
  FormGroup,
  Label,
  ErrorText,
  Spinner
} from '../components/styled/Common';

const Profile = () => {
  const { user, updateProfile, isUpdatingProfile, updateProfileError, isLoadingUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (user && !isEditing) {
      setEmail(user.data?.email || user.email || '');
    }
  }, [user, isEditing]);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Email validation
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSave = async () => {
    if (!email || emailError) {
      return;
    }

    try {
      await updateProfile({ email });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setEmail(user?.data?.email || user?.email || '');
    setEmailError('');
    setIsEditing(false);
  };

  const handleBack = () => {
    window.history.back();
  };

  if (!user || isLoadingUser) {
    return (
      <ProfileContainer>
        <LoadingContainer>
          <Spinner size="2rem" />
          <Text>Loading profile...</Text>
        </LoadingContainer>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <Container>
        <ProfileCard>
          <Header>
            <BackButton onClick={handleBack}>
              <ArrowLeft size={20} />
            </BackButton>
            <Title>Profile</Title>
          </Header>

          <ProfileContent>
            <ProfileSection>
              <ProfileField>
                <Label>Name</Label>
                <ReadOnlyField>
                  <User size={20} />
                  <span>{user?.data?.name}</span>
                </ReadOnlyField>
              </ProfileField>

              <ProfileField>
                <Label>Email Address</Label>
                {isEditing ? (
                  <EditField>
                    <InputContainer>
                      <InputIcon>
                        <Mail size={20} />
                      </InputIcon>
                      <StyledInput
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter email address"
                        autoFocus
                      />
                    </InputContainer>
                    {emailError && (
                      <ErrorText>{emailError}</ErrorText>
                    )}
                    {updateProfileError && (
                      <ErrorText>
                        {updateProfileError.response?.data?.message || 'Failed to update email'}
                      </ErrorText>
                    )}
                    <ButtonGroup>
                      <Button
                        type="button"
                        onClick={handleSave}
                        disabled={!email || !!emailError || isUpdatingProfile}
                        variant="primary"
                      >
                        <Save size={16} />
                        {isUpdatingProfile ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCancel}
                        variant="secondary"
                      >
                        <X size={16} />
                        Cancel
                      </Button>
                    </ButtonGroup>
                  </EditField>
                ) : (
                  <ReadOnlyField>
                    <Mail size={20} />
                    <span>{user?.data?.email}</span>
                    <EditButton onClick={() => setIsEditing(true)}>
                      Edit
                    </EditButton>
                  </ReadOnlyField>
                )}
              </ProfileField>
            </ProfileSection>
          </ProfileContent>
        </ProfileCard>
      </Container>
    </ProfileContainer>
  );
};

export default Profile;

const ProfileContainer = styled(PageContainer)`
  background-color: #f9fafb;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ProfileCard = styled(Card)`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProfileField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ReadOnlyField = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #374151;
  position: relative;
`;

const EditField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputContainer = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  z-index: 1;
`;

const StyledInput = styled(Input)`
  padding-left: 2.5rem;
`;

const EditButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6366f1;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f0ff;
    color: #4f46e5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;
