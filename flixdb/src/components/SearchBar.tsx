import React, { useState, useEffect, useCallback } from 'react';
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
}

const SearchBar: React.FC<SearchBarProps> = ({ onMovieClick }) => {
  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const theme = useTheme();

  // Stable fetch function without debounce directly in useCallback
  const fetchMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get<{ success: boolean; data: Movie[]; message: string }>(
        `http://localhost:3001/api/movies/search?query=${encodeURIComponent(query)}`
      );
      setSearchResults(response.data.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    }
  };

  // Debounced version of fetchMovies created inside useEffect to avoid dependency issues
  const debouncedFetchMovies = useCallback(debounce(fetchMovies, 500), []);

  useEffect(() => {
    debouncedFetchMovies(query);
    // Cleanup debounce on component unmount
    return () => {
      debouncedFetchMovies.cancel();
    };
  }, [query, debouncedFetchMovies]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
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
            zIndex: 1,
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
