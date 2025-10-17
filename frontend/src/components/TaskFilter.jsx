import { Search, Filter, ChevronDown, RefreshCw, Clock, Hourglass, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
  Input, 
  Button
} from './styled/Common';

const TaskFilter = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ search: value, status });
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    onFilterChange({ search, status: value });
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    onFilterChange({ search: '', status: '' });
  };

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

  return (
    <FilterContainer>
      <SearchContainer>
        <SearchIcon>
          <Search size={20} />
        </SearchIcon>
        <SearchInput
          id="search-input"
          name="search-input"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={handleSearchChange}
          aria-label="Search tasks"
        />
      </SearchContainer>
      
      <FilterControls>
        <FilterSelectContainer ref={dropdownRef}>
          <FilterButton
            onClick={toggleDropdown}
            aria-label="Filter by status"
            aria-expanded={isDropdownOpen}
          >
            {status && (
              <StatusIcon>
                {status === 'completed' && <CheckCircle size={16} color="#16a34a" />}
                {status === 'in_progress' && <Hourglass size={16} color="#1e40af" />}
                {status === 'pending' && <Clock size={16} color="#6b7280" />}
              </StatusIcon>
            )}
            <FilterText>
              {status ? status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Status'}
            </FilterText>
            <ChevronIcon $isOpen={isDropdownOpen}>
              <ChevronDown size={16} />
            </ChevronIcon>
          </FilterButton>
          
          {isDropdownOpen && (
            <DropdownMenu>
              <DropdownItem
                onClick={() => handleStatusChange('')}
                $isSelected={status === ''}
              >
                All Status
              </DropdownItem>
              <DropdownItem
                onClick={() => handleStatusChange('pending')}
                $isSelected={status === 'pending'}
              >
                <StatusIcon>
                  <Clock size={16} color="#6b7280" />
                </StatusIcon>
                Pending
              </DropdownItem>
              <DropdownItem
                onClick={() => handleStatusChange('in_progress')}
                $isSelected={status === 'in_progress'}
              >
                <StatusIcon>
                  <Hourglass size={16} color="#1e40af" />
                </StatusIcon>
                In Progress
              </DropdownItem>
              <DropdownItem
                onClick={() => handleStatusChange('completed')}
                $isSelected={status === 'completed'}
              >
                <StatusIcon>
                  <CheckCircle size={16} color="#16a34a" />
                </StatusIcon>
                Completed
              </DropdownItem>
            </DropdownMenu>
          )}
        </FilterSelectContainer>
        
        {(search || status) && (
          <ClearButton
            onClick={clearFilters}
            variant="secondary"
            title="Clear filters"
          >
            <RefreshCw size={16} />
          </ClearButton>
        )}
      </FilterControls>
    </FilterContainer>
  );
};

export default TaskFilter;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  z-index: 1;
`;

const SearchInput = styled(Input)`
  padding-left: 2.5rem;
  height: 2.5rem; /* FilterSelect와 동일한 높이로 설정 */
  box-sizing: border-box;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterSelectContainer = styled.div`
  position: relative;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 150px;
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

const FilterIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  color: #9ca3af;
`;

const FilterText = styled.span`
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
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  margin-top: 0.25rem;
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

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
`;

const ClearButton = styled(Button)`
  white-space: nowrap;
  padding: 0.5rem;
  min-width: auto;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;