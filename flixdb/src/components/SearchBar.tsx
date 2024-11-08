import React, { useState, useEffect, useRef } from 'react';
import { TextField, Box, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import debounce from 'lodash/debounce';

interface Movie {
  id: number;
  title: string;
}

interface SearchBarProps {
  onMovieClick: () => void;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onMovieClick, onClose }) => {
  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const theme = useTheme();
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch movies based on query
  const fetchMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get<{ data: Movie[] }>(
        `http://localhost:3001/api/movies/search?query=${encodeURIComponent(query)}`
      );
      setSearchResults(response.data.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    }
  };

  // Debounce fetchMovies
  useEffect(() => {
    const debouncedFetch = debounce(fetchMovies, 500);
    if (query) {
      debouncedFetch(query);
    }
    return () => {
      debouncedFetch.cancel();
    };
  }, [query]);

  // Update query state on input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  // Handle clicks outside the search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <Box ref={searchRef} sx={{ width: '100%', position: 'relative' }}>
      <TextField
        variant="outlined"
        placeholder="Search..."
        value={query}
        onChange={handleInputChange}
        fullWidth
        sx={{ flexGrow: 1 }}
        inputProps={{ 'aria-label': 'Search movies' }}
      />
      {searchResults.length > 0 && (
        <List
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
            boxShadow: 1,
            zIndex:1,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {searchResults.map((movie) => (
            <ListItem
              key={movie.id}
              component={Link}
              to={`/movies/${movie.id}`}
              button
              onClick={onMovieClick}
              sx={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItemText primary={movie.title} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SearchBar;
