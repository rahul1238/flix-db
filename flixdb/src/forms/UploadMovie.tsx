import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Genre {
  id: number;
  name: string;
  description: string;
}

const UploadMoviePage: React.FC = () => {
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
        const response = await axios.get('http://localhost:3001/api/genres');
        setGenres(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
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
    if (value.includes('create-new')) {
      setIsCreatingGenre(true);
      return;
    }
    setGenreIds(value as number[]);
  };

  const handleCreateGenre = async () => {
    if (!newGenreName || !newGenreDescription) {
      setFeedbackMessage('Please fill out all fields to create a new genre.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/genres', {
        name: newGenreName,
        description: newGenreDescription,
      });
      const newGenre = response.data;
      setGenres([...genres, newGenre]);
      setGenreIds((prev) => [...prev, newGenre.id]);
      setIsCreatingGenre(false);
      setNewGenreName('');
      setNewGenreDescription('');
      setFeedbackMessage('Genre created successfully!');
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
    genreIds.forEach((id) => formData.append('genreIds', id.toString()));
    if (images) {
      Array.from(images).forEach((image) => {
        formData.append('image', image);
      });
    }

    try {
      const response = await axios.post('http://localhost:3001/api/movies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      setFeedbackMessage('Movie uploaded successfully!');
      console.log('Movie uploaded successfully:', response.data);
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
    <Container>
      <Typography variant="h4" gutterBottom>
        Upload New Movie
      </Typography>
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
            style={{ display: 'none' }}
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
