import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Clock, Hourglass, CheckCircle } from 'lucide-react';
import styled from 'styled-components';
import { 
  Button, 
  Input, 
  TextArea, 
  Select,
  FormGroup, 
  Label
} from './styled/Common';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStatusChange = (status) => {
    setFormData({
      ...formData,
      status: status,
    });
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} color="#16a34a" />;
      case 'in_progress':
        return <Hourglass size={16} color="#1e40af" />;
      case 'pending':
      default:
        return <Clock size={16} color="#6b7280" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <FormContainer>
      <div className="form-header">
        <h3 className="form-title">
          {task ? 'Edit Task' : 'Create New Task'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="close-button"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title *</Label>
          <Input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="status">Status</Label>
          <StatusSelectContainer ref={dropdownRef}>
            <StatusSelectButton
              type="button"
              onClick={toggleDropdown}
              aria-label="Select status"
              aria-expanded={isDropdownOpen}
            >
              <StatusIcon>
                {getStatusIcon(formData.status)}
              </StatusIcon>
              <StatusText>
                {getStatusText(formData.status)}
              </StatusText>
              <ChevronIcon $isOpen={isDropdownOpen}>
                <ChevronDown size={16} />
              </ChevronIcon>
            </StatusSelectButton>
            
            {isDropdownOpen && (
              <StatusDropdownMenu>
                <StatusDropdownItem
                  onClick={() => handleStatusChange('pending')}
                  $isSelected={formData.status === 'pending'}
                >
                  <StatusIcon>
                    <Clock size={16} color="#6b7280" />
                  </StatusIcon>
                  Pending
                </StatusDropdownItem>
                <StatusDropdownItem
                  onClick={() => handleStatusChange('in_progress')}
                  $isSelected={formData.status === 'in_progress'}
                >
                  <StatusIcon>
                    <Hourglass size={16} color="#1e40af" />
                  </StatusIcon>
                  In Progress
                </StatusDropdownItem>
                <StatusDropdownItem
                  onClick={() => handleStatusChange('completed')}
                  $isSelected={formData.status === 'completed'}
                >
                  <StatusIcon>
                    <CheckCircle size={16} color="#16a34a" />
                  </StatusIcon>
                  Completed
                </StatusDropdownItem>
              </StatusDropdownMenu>
            )}
          </StatusSelectContainer>
        </FormGroup>

        <div className="form-actions">
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
          >
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default TaskForm;

const FormContainer = styled.div`
  .form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  .form-title {
    font-size: 1.125rem;
    font-weight: 500;
    color: #111827;
    margin: 0;
  }
  
  .close-button {
    color: #9ca3af;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    
    &:hover {
      color: #6b7280;
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding-top: 1rem;
  }
`;

const StatusSelectContainer = styled.div`
  position: relative;
`;

const StatusSelectButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  height: 2.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  box-sizing: border-box;

  &:hover {
    border-color: #6366f1;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
  }
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
`;

const StatusText = styled.span`
  flex: 1;
  text-align: left;
  font-size: 0.875rem;
  color: #374151;
`;

const ChevronIcon = styled.div`
  display: flex;
  align-items: center;
  color: #6b7280;
  transition: transform 0.15s ease-in-out;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const StatusDropdownMenu = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  margin-bottom: 0.25rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const StatusDropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  background-color: ${props => props.$isSelected ? '#eef2ff' : 'transparent'};
  color: ${props => props.$isSelected ? '#6366f1' : '#374151'};

  &:hover {
    background-color: ${props => props.$isSelected ? '#eef2ff' : '#f9fafb'};
  }

  &:first-child {
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
  }

  &:last-child {
    border-bottom-left-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }
`;