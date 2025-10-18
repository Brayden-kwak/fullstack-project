import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import styled from 'styled-components';
import { getStatusIcon, getStatusOptions } from '../../utils/taskUtils';

const StatusDropdown = ({ 
  value, 
  onChange, 
  placeholder = 'Select status',
  showAllOption = false,
  disabled = false,
  direction = 'down', // 'up' or 'down'
  width = '100%' // custom width
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const statusOptions = showAllOption 
    ? [{ value: '', label: 'All Status', icon: null }, ...getStatusOptions()]
    : getStatusOptions();

  const selectedOption = statusOptions.find(option => option.value === value);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DropdownContainer ref={dropdownRef} $width={width}>
      <DropdownButton
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        aria-label="Select status"
        aria-expanded={isOpen}
      >
        {selectedOption?.icon && (
          <StatusIcon>
            {getStatusIcon(selectedOption.icon)}
          </StatusIcon>
        )}
        <StatusText>
          {selectedOption ? selectedOption.label : placeholder}
        </StatusText>
        <ChevronIcon $isOpen={isOpen}>
          <ChevronDown size={16} />
        </ChevronIcon>
      </DropdownButton>
      
      {isOpen && (
        <DropdownMenu $direction={direction}>
          {statusOptions.map((option) => (
            <DropdownItem
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              $isSelected={value === option.value}
            >
              {option.icon && (
                <StatusIcon>
                  {getStatusIcon(option.icon)}
                </StatusIcon>
              )}
              {option.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

export default StatusDropdown;

const DropdownContainer = styled.div`
  position: relative;
  width: ${props => props.$width};
`;

const DropdownButton = styled.button`
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

  &:hover:not(:disabled) {
    border-color: #6366f1;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const DropdownMenu = styled.div`
  position: absolute;
  ${props => props.$direction === 'up' ? 'bottom: 100%;' : 'top: 100%;'}
  left: 0;
  right: 0;
  z-index: 50;
  ${props => props.$direction === 'up' ? 'margin-bottom: 0.25rem;' : 'margin-top: 0.25rem;'}
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const DropdownItem = styled.div`
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
