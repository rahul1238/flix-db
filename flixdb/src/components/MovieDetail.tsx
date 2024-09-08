import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box, Grid, Card, CardContent, CardMedia, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import GenrePopup from './GenrePopUp';
import PromoterPopup from './PromoterPopUp';
import { formatDate } from '../utils/formatDate';

interface Genre {
  id: number;
  name: string;
  description: string;
}

interface Promoter {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  status: string;
  director: string | null;
}

interface Review {
  id: number;
  feedback: string;
  rating: number;
}

interface Movie {
  id: number;
  title: string;
  type: string;
  origin: string;
  description: string;
  releaseDate: string;
  status: string;
  imageUrl: string[];
  promoter: Promoter;
  genres: Genre[];
  reviews: Review[];
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [selectedPromoter, setSelectedPromoter] = useState<Promoter | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get<{ success: boolean; data: Movie; message: string }>(
          `http://localhost:3001/api/movies/${id}`
        );
        setMovie(response.data.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleGenreClick = (genre: Genre) => setSelectedGenre(genre);
  const handleGenrePopupClose = () => setSelectedGenre(null);
  const handlePromoterClick = (promoter: Promoter) => setSelectedPromoter(promoter);
  const handlePromoterPopupClose = () => setSelectedPromoter(null);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Typography variant="h6" align="center">
        No movie details available.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography align="center" variant="h4" component="div" color="textPrimary" sx={{ mb: 2 }}>
        {movie.title}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {movie.imageUrl && movie.imageUrl.length > 0 ? (
              movie.imageUrl.map((url, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      image={url}
                      alt={`Movie image ${index + 1}`}
                      loading="lazy"
                      sx={{ height: '100%', objectFit: 'cover' }}
                    />
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" align="center">
                No images available.
              </Typography>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Description</Typography>
              <Typography variant="body1" gutterBottom>
                {movie.description}
              </Typography>
              <Typography variant="h6">Release Date</Typography>
              <Typography variant="body2" color="textSecondary">
                {formatDate(movie.releaseDate)}
              </Typography>
              <Typography variant="h6">Origin</Typography>
              <Typography variant="body2" color="textSecondary">
                {movie.origin}
              </Typography>
              <Typography variant="h6">Type</Typography>
              <Typography variant="body2" color="textSecondary">
                {movie.type === 'movie' ? 'Movie' : movie.type}
              </Typography>
              <Typography variant="h6">Promoter</Typography>
              <Typography variant="body2" color="textSecondary">
                <span
                  style={{ textDecoration: 'none', color: 'blue', cursor: 'pointer' }}
                  onClick={() => handlePromoterClick(movie.promoter)}
                >
                  {movie.promoter.name}
                </span>
              </Typography>
              <Typography variant="h6" gutterBottom>
                Genres
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {movie.genres && movie.genres.length > 0 ? (
                  movie.genres.map((genre) => (
                    <Box
                      key={genre.id}
                      sx={{
                        padding: '4px 12px',
                        borderRadius: '16px',
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                        display: 'inline-block',
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                        },
                      }}
                      onClick={() => handleGenreClick(genre)}
                    >
                      <Typography variant="body2" color="primary">
                        {genre.name}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No genres available.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Reviews
        </Typography>
        {movie.reviews && movie.reviews.length > 0 ? (
          movie.reviews.map((review) => (
            <Card key={review.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Rating: {review.rating}
                </Typography>
                <Typography variant="body1">{review.feedback}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No reviews available.
          </Typography>
        )}
      </Box>
      <GenrePopup open={!!selectedGenre} onClose={handleGenrePopupClose} genre={selectedGenre} />
      <PromoterPopup open={!!selectedPromoter} onClose={handlePromoterPopupClose} promoter={selectedPromoter} />
    </Box>
  );
};

export default MovieDetail;
