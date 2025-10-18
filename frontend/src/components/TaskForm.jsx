import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styled from 'styled-components';
import { 
  Button, 
  Input, 
  TextArea,
  FormGroup, 
  Label
} from './styled/Common';
import StatusDropdown from './common/StatusDropdown';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
  });

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
  };

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
          <StatusDropdown
            value={formData.status}
            onChange={handleStatusChange}
            placeholder="Select status"
            direction="up"
          />
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
