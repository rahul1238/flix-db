import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Card, CardMedia, CardContent, Paper } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import { useNavContext } from '../context/NavContext';

interface Movie {
  id: number;
  title: string;
  type: string;
  origin: string;
  description: string;
  releaseDate: string;
  status: string;
  imageUrl: string[];
}

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

  const { drawerOpen } = useNavContext();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/movies');
        const moviesData = Array.isArray(response.data.movies) ? response.data.movies : [];
        setMovies(moviesData);
        if (moviesData.length > 0) {
          const randomIndex = Math.floor(Math.random() * moviesData.length);
          setFeaturedMovie(moviesData[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      }
    };

    fetchMovies();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        padding: 2,
        transition: 'transform 0.3s ease-in-out',
        transform: drawerOpen ? 'translateX(250px)' : 'translateX(0)',
      }}
    >
      {featuredMovie && (
        <Card sx={{ marginBottom: 2 }}>
          <CardMedia
            component="img"
            height="500"
            image={featuredMovie.imageUrl[0]}
            alt={featuredMovie.title}
          />
          <CardContent>
            <Typography variant="h4">{featuredMovie.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {featuredMovie.description}
            </Typography>
          </CardContent>
        </Card>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Featured Today
          </Typography>
          <Grid container spacing={3}>
            {movies.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#2c2c2c' }}>
            <Typography variant="h6" gutterBottom>
              Up Next
            </Typography>
            {movies.slice(1, 5).map((movie) => (
              <Box key={movie.id} sx={{ display: 'flex', marginBottom: 2 }}>
                <img
                  src={movie.imageUrl[0]}
                  alt={movie.title}
                  style={{ width: '80px', height: '120px', marginRight: 2 }}
                />
                <Box>
                  <Typography
                    variant="body1"
                    component={Link}
                    to={`/movies/${movie.id}`}
                    sx={{ textDecoration: 'none', color: '#ffffff' }}
                  >
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(movie.releaseDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
