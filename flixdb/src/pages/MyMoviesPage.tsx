import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, Card, CardContent, CardMedia, Snackbar, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavContext } from '../context/NavContext';

interface Movie {
  id: number;
  title: string;
  type: string;
  origin: string;
  description: string;
  releaseDate: string;
  imageUrl: string[];
}

const MyMoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useAuth();
  const { drawerOpen } = useNavContext();

  useEffect(() => {
    const fetchMovies = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`http://localhost:3001/api/movies?promoterId=${user.id}`);
        setMovies(response.data.movies);
      } catch (error) {
        setErrorMessage('Failed to fetch movies. Please try again later.');
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [user]);

  const handleSnackbarClose = () => {
    setErrorMessage(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3,
      transform: drawerOpen ? 'translateX(240px)' : 'translateX(0)',
      transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1)',
     }}>
      <Typography variant="h4" gutterBottom>
        My Movies
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/upload">
        Add New Movie
      </Button>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={movie.imageUrl[0] || '/path/to/fallback/image.jpg'} 
                alt={movie.title}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Origin: {movie.origin}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={errorMessage}
      />
    </Box>
  );
};

export default MyMoviesPage;
