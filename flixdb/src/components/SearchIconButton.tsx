import React, { useRef } from 'react';
import { IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchIconButtonProps {
  onSearchIconClick: () => void;
  isOpen: boolean;
}

const SearchIconButton: React.FC<SearchIconButtonProps> = ({ onSearchIconClick, isOpen }) => {
  const iconRef = useRef<HTMLButtonElement>(null);

  return (
    <IconButton color="inherit" onClick={onSearchIconClick} ref={iconRef} aria-label="search">
      <SearchIcon />
    </IconButton>
  );
};

export default SearchIconButton;