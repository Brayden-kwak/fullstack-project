import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TaskFilter from '../components/TaskFilter';
import { Plus, LogOut, User } from 'lucide-react';
import styled from 'styled-components';
import { 
  PageContainer, 
  Card, 
  Title, 
  Text, 
  Button, 
  FlexContainer,
  Spinner
} from '../components/styled/Common';

const Tasks = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
  });

  const { user, logout } = useAuth();
  const { 
    tasks, 
    allTasks,
    isLoading, 
    createTask, 
    updateTask, 
    deleteTask, 
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    createError,
    updateError,
    deleteError
  } = useTasks(filters);

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setShowForm(false);
      // 스크롤은 useTasks에서 처리됨 (optimistic update)
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete.id);
        setShowDeleteModal(false);
        setTaskToDelete(null);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleUserClick = () => {
    navigate('/profile');
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200; // 하단 200px 전
        
    // 하단에 가까워졌을 때 다음 페이지 로드
    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, allTasks.length]);

  // Add scroll event listener with throttling
  useEffect(() => {
    let timeoutId;
    const throttledHandleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 100); // 100ms throttle
    };

    window.addEventListener('scroll', throttledHandleScroll);
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll]);
  
  return (
    <TasksContainer>
      <Header>
        <HeaderContent>
          <HeaderFlex>
            <Title style={{ margin: 0 }}>Home</Title>
            <FlexContainer>
              <UserInfo onClick={handleUserClick}>
                <User size={20} />
                <span>{user?.data?.name}</span>
              </UserInfo>
              <LogoutButton onClick={logout} variant="secondary">
                <LogOut size={16} />
                <span>Logout</span>
              </LogoutButton>
            </FlexContainer>
          </HeaderFlex>
        </HeaderContent>
      </Header>

      <MainContent>
        <ControlsSection>
          <ControlsFlex>
            <FilterContainer>
              <TaskFilter onFilterChange={handleFilterChange} />
            </FilterContainer>
            <AddButton onClick={() => setShowForm(true)}>
              <Plus size={16} />
              <span>Add Task</span>
            </AddButton>
          </ControlsFlex>
        </ControlsSection>

        {/* Error Messages */}
        {(createError || updateError || deleteError) && (
          <ErrorContainer>
            {createError && (
              <ErrorMessage>
                Failed to create task: {createError.message}
              </ErrorMessage>
            )}
            {updateError && (
              <ErrorMessage>
                Failed to update task: {updateError.message}
              </ErrorMessage>
            )}
            {deleteError && (
              <ErrorMessage>
                Failed to delete task: {deleteError.message}
              </ErrorMessage>
            )}
          </ErrorContainer>
        )}

        {/* Task List */}
        <TasksCard>
          {isLoading ? (
            <LoadingContainer>
              <Spinner size="2rem" />
              <LoadingText>Loading tasks...</LoadingText>
            </LoadingContainer>
          ) : (
            <>
              <TaskList
                tasks={tasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
              {/* Infinite scroll loading indicator */}
              {isFetchingNextPage && (
                <LoadingContainer>
                  <Spinner size="1.5rem" />
                  <LoadingText>Loading more tasks... ({allTasks.length} loaded)</LoadingText>
                </LoadingContainer>
              )}
              {/* End of data indicator */}
              {!hasNextPage && allTasks.length > 0 && (
                <EndOfDataText>
                  All tasks loaded ({allTasks.length} total tasks)
                </EndOfDataText>
              )}
            </>
          )}
        </TasksCard>

        {/* Task Form Modal */}
        {showForm && (
          <ModalOverlay>
            <ModalContent>
              <TaskForm
                task={editingTask}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                onCancel={handleCloseForm}
              />
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <ModalOverlay>
            <DeleteModal>
              <DeleteModalHeader>
                <DeleteIcon>⚠️</DeleteIcon>
                <DeleteTitle>Delete Task</DeleteTitle>
              </DeleteModalHeader>
              <DeleteModalBody>
                <DeleteText>
                  Are you sure you want to delete "{taskToDelete?.title}"?
                </DeleteText>
                <DeleteWarning>
                  This action cannot be undone.
                </DeleteWarning>
              </DeleteModalBody>
              <DeleteModalActions>
                <Button
                  variant="secondary"
                  onClick={cancelDelete}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmDelete}
                >
                  Delete
                </Button>
              </DeleteModalActions>
            </DeleteModal>
          </ModalOverlay>
        )}
      </MainContent>
    </TasksContainer>
  );
};

export default Tasks;

const TasksContainer = styled(PageContainer)`
  background-color: #f9fafb;
`;

const Header = styled.header`
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeaderFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem 0.2rem;
  border-radius: 0.375rem;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
`;

const LogoutButton = styled(Button)`
  background: none;
  border: none;
  color: #374151;
  padding: 0.5rem 0.75rem;
  
  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ControlsSection = styled.div`
  margin-bottom: 2rem;
`;

const ControlsFlex = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const FilterContainer = styled.div`
  flex: 1;
  max-width: 500px;
`;

const AddButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
`;

const TasksCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

const LoadingText = styled(Text)`
  margin-top: 0.5rem;
  color: #6b7280;
`;

const EndOfDataText = styled(Text)`
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  padding: 1rem;
  margin-top: 1rem;
`;

const ErrorContainer = styled.div`
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const DeleteModal = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 0;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const DeleteModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1.5rem 0 1.5rem;
`;

const DeleteIcon = styled.div`
  font-size: 1.5rem;
`;

const DeleteTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

const DeleteModalBody = styled.div`
  padding: 1rem 1.5rem;
`;

const DeleteText = styled.p`
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-size: 0.875rem;
`;

const DeleteWarning = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 0.75rem;
`;

const DeleteModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0 1.5rem 1.5rem 1.5rem;
`;