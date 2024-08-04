import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Card, CardMedia, CardContent, Paper } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';

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

  useEffect(() => {
    axios.get('http://localhost:3001/api/movies')
      .then(response => {
        const moviesData = Array.isArray(response.data.movies) ? response.data.movies : [];
        setMovies(moviesData);
        if (moviesData.length > 0) {
          setFeaturedMovie(moviesData[0]); 
        }
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setMovies([]);
      });
  }, []);

  return (
    <Box sx={{ backgroundColor: '#1a1a1a', color: '#ffffff', padding: '16px' }}>
      {featuredMovie && (
        <Card sx={{ marginBottom: '16px' }}>
          <CardMedia
            component="img"
            height="500"
            image={featuredMovie.imageUrl[0]}
            alt={featuredMovie.title}
          />
          <CardContent>
            <Typography variant="h4" component="div">
              {featuredMovie.title}
            </Typography>
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
            {movies.map(movie => (
              <Grid item key={movie.id} xs={12} sm={6} md={4}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: '16px', backgroundColor: '#2c2c2c' }}>
            <Typography variant="h6" gutterBottom>
              Up Next
            </Typography>
            {movies.slice(1, 5).map(movie => (
              <Box key={movie.id} sx={{ display: 'flex', marginBottom: '16px' }}>
                <img src={movie.imageUrl[0]} alt={movie.title} style={{ width: '80px', height: '120px', marginRight: '16px' }} />
                <Box>
                  <Typography variant="body1" component={Link} to={`/movies/${movie.id}`} sx={{ textDecoration: 'none', color: '#ffffff' }}>
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
