import { Search, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import styled from 'styled-components';
import { 
  Input, 
  Button
} from './styled/Common';
import StatusDropdown from './common/StatusDropdown';

const TaskFilter = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ search: value, status });
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    onFilterChange({ search, status: value });
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    onFilterChange({ search: '', status: '' });
  };

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
        <StatusDropdown
          value={status}
          onChange={handleStatusChange}
          placeholder="All Status"
          showAllOption={true}
          direction="down"
          width="150px"
        />
        
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