import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    releaseDate: string;
    origin: string;
    imageUrl: string[];
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movies/${movie.id}`);
  };

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardActionArea onClick={handleCardClick}>
        <CardMedia
          component="img"
          height="140"
          image={movie.imageUrl[0]} 
          alt={movie.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Release Date: {movie.releaseDate}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Origin: {movie.origin}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;