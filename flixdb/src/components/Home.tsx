import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Card, CardMedia, CardContent, Paper, Tabs, Tab, Skeleton, Stack, IconButton, alpha, Container } from '@mui/material';
import { api, url as apiUrl } from '../utils/api';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import PageIntro from './PageIntro';
import { useNavContext } from '../context/NavContext';
import { motion } from 'framer-motion';
import RefreshIcon from '@mui/icons-material/Refresh';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [heroBroken, setHeroBroken] = useState(false);

  const { drawerOpen } = useNavContext();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setError(null);
        setLoading(true);
  const response = await api.get('/api/movies');
        const moviesData = Array.isArray(response.data.movies) ? response.data.movies : [];
        setMovies(moviesData);
        if (moviesData.length > 0) {
          const randomIndex = Math.floor(Math.random() * moviesData.length);
          setFeaturedMovie(moviesData[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Failed to load movies.');
        setMovies([]);
      }
      finally { setLoading(false); }
    };

    fetchMovies();
  }, []);

  // Reset broken flag if featured changes
  useEffect(() => { setHeroBroken(false); }, [featuredMovie?.id]);

  const filteredMovies = tab === 'all' ? movies : movies.filter(m => m.type === tab);

  // Ensure backend-relative image paths become absolute
  const resolveImage = (url?: string) => {
    if (!url) return undefined;
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) return url; // already absolute or data URI
    return apiUrl(`/${url.replace(/^\//, '')}`);
  };

  return (
    <Box sx={{
      py: 3,
      position: 'relative',
      transform: drawerOpen ? 'translateX(240px)' : 'translateX(0)',
      transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1)'
    }}>
      <Container maxWidth="xl">
        {featuredMovie && !loading && (
          <Card
            key={featuredMovie.id}
            component={motion.div}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            sx={{
              mb: 4,
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              width: '100%',
              maxWidth: 1200,
              mx: 'auto',
              height: { xs: 260, sm: 320, md: 420 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}
          >
            <Box sx={{ position: 'absolute', inset: 0 }}>
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0) 0%, rgba(0,0,0,.7) 100%)', zIndex: 1 }} />
              {!heroBroken && (
                <CardMedia
                  component="img"
                  src={resolveImage(featuredMovie.imageUrl?.[0])}
                  alt=""
                  loading="lazy"
                  onError={() => setHeroBroken(true)}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
              {heroBroken && (
                <Box sx={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'#777', fontSize:24, fontWeight:600, background:(t)=> t.palette.mode==='dark'? '#222':'#e0e0e0' }}>
                  Image unavailable
                </Box>
              )}
            </Box>
            <CardContent sx={{ position: 'relative', zIndex: 2, color: '#fff' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{featuredMovie.title}</Typography>
                <IconButton aria-label="shuffle featured" size="small" onClick={() => {
                  if (movies.length > 1) {
                    const idx = Math.floor(Math.random() * movies.length);
                    setFeaturedMovie(movies[idx]);
                  }
                }} sx={{ background: (t) => alpha(t.palette.background.paper, .35), backdropFilter: 'blur(4px)', '&:hover': { background: (t) => alpha(t.palette.background.paper, .55) } }}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Typography variant="body2" sx={{ mt: 1, maxWidth: 760 }} noWrap>
                {featuredMovie.description}
              </Typography>
            </CardContent>
          </Card>
        )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }} variant="scrollable" allowScrollButtonsMobile>
        <Tab label="All" value="all" />
        <Tab label="Movies" value="movie" />
        <Tab label="Series" value="series" />
        <Tab label="TV" value="television" />
        <Tab label="Documentary" value="documentary" />
        <Tab label="Anime" value="anime" />
        <Tab label="Short" value="short" />
        <Tab label="Special" value="special" />
      </Tabs>

      {/* Consolidated platform introduction */}
      <PageIntro
        title="Explore, Curate & Share"
        subtitle="A growing catalog of films, series and documentaries."
        paragraphs={[
          'Browse the latest additions, discover hidden gems and keep an eye on what\'s coming next. Each title page will soon surface richer context: cast, creators, genres, reviews and promotional insights.',
          'Use the filters above to switch views. More discovery facets (rating, genre, year, popularity) are planned. Your feedback helps us prioritize – reach out via the Help page.'
        ]}
        dense
      >
        <Typography variant="body2" color="text.secondary">
          Tip: Click the refresh icon on the hero to spotlight a different featured title.
        </Typography>
      </PageIntro>

      {error && (
        <Paper sx={{ p:2, mb:3, border: '1px solid', borderColor: 'error.main' }}>
          <Typography color="error" variant="body2">{error}</Typography>
        </Paper>
      )}

  <Grid container spacing={4}>
        <Grid item xs={12} md={9}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            {tab === 'all' ? 'Discover' : `${tab.charAt(0).toUpperCase()+tab.slice(1)} Picks`}
          </Typography>
          <Grid container spacing={2}>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Grid key={i} item xs={12} sm={6} md={4}>
                  <Skeleton variant="rectangular" height={340} sx={{ borderRadius: 3 }} />
                  <Skeleton height={28} sx={{ mt: 1, width: '70%' }} />
                  <Skeleton height={20} width="40%" />
                </Grid>
              ))
            ) : (
              filteredMovies.map((movie) => (
                <Grid item key={movie.id} xs={12} sm={6} md={4}>
                  <MovieCard movie={movie} />
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={4} sx={{ p:2, borderRadius: 4, position: 'sticky', top: 96, minHeight: 320, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
              Up Next
            </Typography>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              {(loading ? Array.from({ length: 4 }) : movies.slice(1, 5)).map((m, idx) => {
                const movieItem = m as Movie | undefined;
                const key = movieItem ? movieItem.id : idx;
                return (
                  <Box key={key} sx={{ display: 'flex', gap: 1.5 }}>
                    {loading || !movieItem ? (
                      <Skeleton variant="rectangular" width={64} height={96} sx={{ borderRadius: 2 }} />
                    ) : (
                      <Box component={Link} to={`/movies/${movieItem.id}`} sx={{ width:64, height:96, borderRadius:2, overflow:'hidden', flexShrink:0, position:'relative', boxShadow:1 }}>
                        <Box component="img" src={movieItem.imageUrl?.[0]} alt={movieItem.title} loading="lazy" sx={{ objectFit:'cover', width:'100%', height:'100%' }} />
                      </Box>
                    )}
                    <Box sx={{ flexGrow:1, minWidth:0 }}>
                      {loading || !movieItem ? (
                        <>
                          <Skeleton height={20} width="80%" />
                          <Skeleton height={16} width="60%" />
                        </>
                      ) : (
                        <>
                          <Typography
                            variant="body2"
                            component={Link}
                            to={`/movies/${movieItem.id}`}
                            sx={{ textDecoration: 'none', fontWeight:600, display:'block' }}
                            noWrap
                          >
                            {movieItem.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(movieItem.releaseDate).toLocaleDateString()}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                );
              })}
              {!loading && movies.slice(1,5).length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Add more titles to populate this list.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      </Container>
    </Box>
  );
};

export default Home;
