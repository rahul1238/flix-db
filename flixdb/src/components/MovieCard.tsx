import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { Theme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';

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

  const resolveImage = (url?: string) => {
    if (!url) return undefined;
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) return url;
    const base = (process.env.REACT_APP_API_BASE || 'http://localhost:3001').replace(/\/$/, '');
    return `${base}/${url.replace(/^\//, '')}`;
  };
  const poster = resolveImage(movie.imageUrl?.[0]);

  const handleCardClick = () => {
    navigate(`/movies/${movie.id}`);
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 2, overflow: 'hidden', borderRadius: 3 }} component={motion.div} whileHover={{ y: -6 }} whileTap={{ scale: 0.97 }}>
      <CardActionArea onClick={handleCardClick} sx={{ alignItems: 'stretch', height: '100%' }}>
        {poster ? (
          <CardMedia
            component="img"
            image={poster}
            alt=""
            loading="lazy"
            role="img"
            aria-label={movie.title}
            sx={{
              height: 340,
              objectFit: 'cover',
              transition: 'transform .5s',
              background: (t: Theme) => t.palette.mode === 'dark' ? '#222' : '#eee'
            }}
          />
        ) : (
          <Skeleton variant="rectangular" height={340} />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Release Date: {formatDate(movie.releaseDate)}
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
