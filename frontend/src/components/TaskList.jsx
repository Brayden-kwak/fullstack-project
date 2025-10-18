import { Edit, Trash2, Clock } from 'lucide-react';
import styled from 'styled-components';
import { StatusBadge } from './styled/Common';
import { getStatusIcon, formatTaskDate } from '../utils/taskUtils';

const TaskList = ({ tasks, onEdit, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <TaskListContainer>
        <EmptyState>
          <EmptyIcon>
            <Clock size={48} />
          </EmptyIcon>
          <EmptyTitle>No tasks found</EmptyTitle>
          <EmptyText>Get started by creating a new task.</EmptyText>
        </EmptyState>
      </TaskListContainer>
    );
  }
  
  return (
    <TaskListContainer>
      {tasks?.length > 0 && tasks?.map((task) => (
        <div key={task.id} className="task-item">
          <TaskItem>
            <TaskContent>
              <TaskHeader>
                {getStatusIcon(task.status, 20)}
                <TaskTitle>{task.title}</TaskTitle>
                <StatusBadge status={task.status}>
                  {task.status.replace('_', ' ')}
                </StatusBadge>
              </TaskHeader>
              {task.description && (
                <TaskDescription>{task.description}</TaskDescription>
              )}
              <TaskMeta>
                Created {formatTaskDate(task.created_at)}
              </TaskMeta>
            </TaskContent>
            <TaskActions>
              <ActionButton
                onClick={() => onEdit(task)}
                title="Edit task"
              >
                <Edit size={16} />
              </ActionButton>
              <ActionButton
                onClick={() => onDelete(task)}
                title="Delete task"
                variant="danger"
              >
                <Trash2 size={16} />
              </ActionButton>
            </TaskActions>
          </TaskItem>
        </div>
      ))}
    </TaskListContainer>
  );
};

export default TaskList;

const TaskListContainer = styled.div`
  .task-item {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    transition: background-color 0.15s ease-in-out;
    
    &:hover {
      background-color: #f9fafb;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const TaskItem = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const TaskContent = styled.div`
  flex: 1;
`;

const TaskHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const TaskTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin: 0;
`;

const TaskDescription = styled.p`
  color: #6b7280;
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

const TaskMeta = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
`;

const TaskActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
`;

const ActionButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant'].includes(prop),
})`
  padding: 0.5rem;
  color: #9ca3af;
  background: none;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  
  &:hover {
    color: ${props => props.variant === 'danger' ? '#ef4444' : '#6366f1'};
    background-color: ${props => props.variant === 'danger' ? '#fef2f2' : '#eef2ff'};
  }
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  color: #9ca3af;
  margin-bottom: 1rem;
  
  svg {
    width: 3rem;
    height: 3rem;
    margin: 0 auto;
  }
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  color: #6b7280;
  margin: 0;
`;