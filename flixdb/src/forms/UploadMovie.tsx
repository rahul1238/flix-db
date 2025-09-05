import React, { useState, useEffect } from 'react';
import {Container,TextField,Button,Box,Select,MenuItem,FormControl,InputLabel,Checkbox,ListItemText,OutlinedInput,SelectChangeEvent,Dialog,DialogTitle,DialogContent,DialogActions,Snackbar,CircularProgress} from '@mui/material';
import PageIntro from '../components/PageIntro';
import { api } from '../utils/api';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface Genre {
  id: number;
  name: string;
  description: string;
}

const UploadMoviePage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [origin, setOrigin] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [genreIds, setGenreIds] = useState<number[]>([]);
  const [rating, setRating] = useState('');
  const [director, setDirector] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [newGenreName, setNewGenreName] = useState('');
  const [newGenreDescription, setNewGenreDescription] = useState('');
  const [isCreatingGenre, setIsCreatingGenre] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/api/genres');
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setGenres(response.data.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setGenres([]); 
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
        setGenres([]); 
      }
    };

    fetchGenres();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(event.target.files);
    }
  };

  const handleGenreChange = (event: SelectChangeEvent<(number | string)[]>) => {
    const { value } = event.target;
    // Value is a union array (numbers coerced to strings internally by MUI Select)
    if ((value as (string | number)[]).includes('create-new')) {
      setIsCreatingGenre(true);
      return;
    }
    // Normalize to numeric IDs, filter out anything invalid
    const normalized = (value as (string | number)[])
      .map(v => typeof v === 'number' ? v : Number(v))
      .filter(v => Number.isFinite(v));
    setGenreIds(normalized as number[]);
  };

  const handleCreateGenre = async () => {
    if (!newGenreName.trim() || !newGenreDescription.trim()) {
      setFeedbackMessage('Please fill out all fields to create a new genre.');
      return;
    }

    try {
      const response = await api.post('/api/genres', {
        name: newGenreName.trim(),
        description: newGenreDescription.trim(),
      });
      // Support both { success, data: {...} } and direct object responses
      const raw = response.data;
      const newGenre: Genre | undefined = (raw && raw.data && typeof raw.data === 'object') ? raw.data : raw;
      if (!newGenre || typeof newGenre.id !== 'number') {
        console.warn('Unexpected genre creation response shape:', raw);
        setFeedbackMessage('Created genre but response format was unexpected. Refresh to verify.');
      } else {
        setGenres(prev => [...prev, newGenre]);
        setGenreIds(prev => [...prev, newGenre.id]);
        setFeedbackMessage('Genre created successfully!');
      }
      setIsCreatingGenre(false);
      setNewGenreName('');
      setNewGenreDescription('');
    } catch (error) {
      console.error('Error creating genre:', error);
      setFeedbackMessage('Failed to create genre.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('origin', origin);
    formData.append('description', description);
    formData.append('releaseDate', releaseDate);
    formData.append('rating', rating);
    formData.append('director', director);
    // Append only valid numeric IDs
    const distinctIds = Array.from(new Set(genreIds)).filter(id => Number.isFinite(id));
    distinctIds.forEach((id) => {
      try {
        formData.append('genreIds', id.toString());
      } catch (e) {
        console.warn('Skipping invalid genre id while appending', id, e);
      }
    });
    if (distinctIds.length === 0) {
      // Optional: server may require at least one genre; keep silent if not mandatory
    }
    if (images) {
      Array.from(images).forEach((image) => {
        formData.append('image', image);
      });
    }

    try {
      const response = await api.post('/api/movies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      setFeedbackMessage('Movie uploaded successfully! Redirecting...');
      console.log('Movie uploaded successfully:', response.data);
      // Navigate to My Movies after a brief tick to ensure state updates flush
      setTimeout(() => navigate('/mymovies'), 400);
    } catch (error) {
      console.error('Error uploading movie:', error);
      setFeedbackMessage('Failed to upload movie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setFeedbackMessage(null);
  };

  return (
    <Container sx={{ py: 2 }}>
      <PageIntro
        title="Submit a Title"
        subtitle="Provide accurate details to help discovery"
        paragraphs={[
          'High‑quality metadata improves search relevance and user trust. Double‑check spelling, select the correct type and prefer concise, spoiler‑free descriptions.',
          'Images: Upload clear vertical artwork (poster style). Multiple images are supported – the first becomes the primary poster.',
          'Genres: Pick the closest existing options or create a new genre if truly missing.'
        ]}
        dense
      />
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as string)}
            required
          >
            <MenuItem value="movie">Movie</MenuItem>
            <MenuItem value="series">Series</MenuItem>
            <MenuItem value="television">Television</MenuItem>
            <MenuItem value="documentary">Documentary</MenuItem>
            <MenuItem value="anime">Anime</MenuItem>
            <MenuItem value="short">Short</MenuItem>
            <MenuItem value="special">Special</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Release Date"
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Director"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Genres</InputLabel>
          <Select
            multiple
            value={genreIds}
            onChange={handleGenreChange}
            input={<OutlinedInput label="Genres" />}
            renderValue={(selected) =>
              (selected as number[]).map((id) => genres.find((genre) => genre.id === id)?.name).join(', ')
            }
          >
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                <Checkbox checked={genreIds.includes(genre.id)} />
                <ListItemText primary={genre.name} />
              </MenuItem>
            ))}
            <MenuItem value="create-new">
              <Button variant="contained" color="primary" onClick={() => setIsCreatingGenre(true)}>
                Create New Genre
              </Button>
            </MenuItem>
          </Select>
        </FormControl>
        <Box mt={2}>
          <input
            accept="image/*"
            id="image-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            hidden
          />
          <label htmlFor="image-upload">
            <Button variant="contained" color="primary" component="span">
              Upload Images
            </Button>
          </label>
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Box>
      </form>

      <Dialog open={isCreatingGenre} onClose={() => setIsCreatingGenre(false)}>
        <DialogTitle>Create New Genre</DialogTitle>
        <DialogContent>
          <TextField
            label="Genre Name"
            value={newGenreName}
            onChange={(e) => setNewGenreName(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Genre Description"
            value={newGenreDescription}
            onChange={(e) => setNewGenreDescription(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreatingGenre(false)}>Cancel</Button>
          <Button onClick={handleCreateGenre} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!feedbackMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={feedbackMessage}
      />
    </Container>
  );
};

export default UploadMoviePage;
