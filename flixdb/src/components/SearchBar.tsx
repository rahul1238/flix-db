import React, { useState, useEffect } from 'react';
import { TextField, Box, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

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

  useEffect(() => {
    const fetchMovies = async () => {
      if (query.trim() === '') {
        setSearchResults([]);
        return;
      }
      try {
        const response = await axios.get<{ success: boolean; data: Movie[]; message: string }>(`http://localhost:3001/api/movies/search?query=${query}`);
        setSearchResults(response.data.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      }
    };

    fetchMovies();
  }, [query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          sx={{ flexGrow: 1 }}
        />
      </Box>
      {searchResults.length > 0 && (
        <List sx={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderRadius: 1,
          boxShadow: 1,
          zIndex: 1,
        }}>
          {searchResults.map((movie) => (
            <ListItem key={movie.id} component={Link} to={`/movies/${movie.id}`} button onClick={onMovieClick}>
              <ListItemText primary={movie.title} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SearchBar;