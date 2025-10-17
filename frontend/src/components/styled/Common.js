import styled from 'styled-components';

// Container
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

// Flex containers
export const FlexContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['align', 'justify', 'gap', 'direction'].includes(prop),
})`
  display: flex;
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || '0'};
  flex-direction: ${props => props.direction || 'row'};
`;

// Buttons
export const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'status'].includes(prop),
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  gap: 0.5rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #6366f1;
          color: white;
          &:hover:not(:disabled) {
            background-color: #4f46e5;
          }
          &:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
          }
        `;
      case 'secondary':
        return `
          background-color: white;
          color: #374151;
          border-color: #d1d5db;
          &:hover:not(:disabled) {
            background-color: #f9fafb;
          }
          &:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
          }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          color: white;
          &:hover:not(:disabled) {
            background-color: #dc2626;
          }
          &:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5);
          }
        `;
      default:
        return `
          background-color: #6366f1;
          color: white;
          &:hover:not(:disabled) {
            background-color: #4f46e5;
          }
          &:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
          }
        `;
    }
  }}

  ${props => props.size === 'sm' && `
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
  `}

  ${props => props.size === 'lg' && `
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  `}
`;

// Input fields
export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`;

// Cards
export const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: ${props => props.padding || '1.5rem'};
`;

// Typography
export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: ${props => props.marginBottom || '0'};
`;

export const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: ${props => props.marginBottom || '0'};
`;

export const Text = styled.p.withConfig({
  shouldForwardProp: (prop) => !['color', 'size', 'marginBottom', 'lineHeight'].includes(prop),
})`
  color: ${props => props.color || '#374151'};
  font-size: ${props => props.size || '0.875rem'};
  margin-bottom: ${props => props.marginBottom || '0'};
  line-height: ${props => props.lineHeight || '1.5'};
`;

// Status badges
export const StatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => !['status'].includes(prop),
})`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;

  ${props => {
    switch (props.status) {
      case 'completed':
        return `
          background-color: #dcfce7;
          color: #166534;
        `;
      case 'in_progress':
        return `
          background-color: #dbeafe;
          color: #1e40af;
        `;
      case 'pending':
      default:
        return `
          background-color: #f3f4f6;
          color: #374151;
        `;
    }
  }}
`;

// Loading spinner
export const Spinner = styled.div`
  display: inline-block;
  width: ${props => props.size || '1rem'};
  height: ${props => props.size || '1rem'};
  border: 2px solid #f3f4f6;
  border-top: 2px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

// Modal overlay
export const ModalOverlay = styled.div`
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

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

// Form elements
export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

export const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.75rem;
`;

// Layout
export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

export const Header = styled.header`
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem 0;
`;

export const MainContent = styled.main`
  padding: 2rem 0;
`;

// Grid
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

// Utility classes
export const TextCenter = styled.div`
  text-align: center;
`;

export const TextRight = styled.div`
  text-align: right;
`;

export const Hidden = styled.div`
  display: none;
`;

export const Visible = styled.div`
  display: block;
`;
