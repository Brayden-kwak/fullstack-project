import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import styled from 'styled-components';
import { Spinner } from './components/styled/Common';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
`;

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return (
      <LoadingContainer>
        <Spinner size="2rem" />
      </LoadingContainer>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Public Route component (redirect to tasks if already logged in)
const PublicRoute = ({ children }) => {
  const { user, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return (
      <LoadingContainer>
        <Spinner size="2rem" />
      </LoadingContainer>
    );
  }

  return user ? <Navigate to="/tasks" /> : children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/tasks" />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;