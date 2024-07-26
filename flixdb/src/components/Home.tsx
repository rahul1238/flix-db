import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import axios from 'axios';
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

  useEffect(() => {
    axios.get('http://localhost:3001/api/movies')
      .then(response => { 
        const moviesData = Array.isArray(response.data.movies) ? response.data.movies : [];
        setMovies(moviesData);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setMovies([]); 
      });
  }, []);

  return (
    <div className="home">
      <h1>Top Movies</h1>
      <Grid container spacing={3}>
        {movies.map(movie => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Home;
