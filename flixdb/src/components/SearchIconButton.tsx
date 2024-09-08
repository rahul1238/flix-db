import React from 'react';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchIconButtonProps {
  onSearch: () => void;
}

const SearchIconButton: React.FC<SearchIconButtonProps> = ({ onSearch }) => {
  return (
    <IconButton 
      color="inherit" 
      onClick={onSearch} 
      aria-label="search" 
      sx={{ p: 1 }} 
    >
      <SearchIcon />
    </IconButton>
  );
};

export default SearchIconButton;
