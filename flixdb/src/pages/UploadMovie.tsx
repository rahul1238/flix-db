import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, OutlinedInput, SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import Cookies from "js-cookie";

interface Genre {
  id: number;
  name: string;
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

  const handleGenreChange = (event: SelectChangeEvent<number[]>) => {
    setGenreIds(event.target.value as number[]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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
          'Authorization': `Bearer ${Cookies.get("token")}`,
        },
      });
      
      console.log('Movie uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading movie:', error);
    }
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
            renderValue={(selected) => (selected as number[]).map(id => genres.find(genre => genre.id === id)?.name).join(', ')}
          >
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                <Checkbox checked={genreIds.indexOf(genre.id) > -1} />
                <ListItemText primary={genre.name} />
              </MenuItem>
            ))}
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
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default UploadMoviePage;
