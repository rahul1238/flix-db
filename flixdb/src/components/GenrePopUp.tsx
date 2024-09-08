import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface GenrePopupProps {
  open: boolean;
  onClose: () => void;
  genre: {
    name: string;
    description: string;
  } | null;
}

const GenrePopup: React.FC<GenrePopupProps> = ({ open, onClose, genre }) => {
  // Avoid rendering the dialog if genre is null
  if (!genre) return null;

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="genre-dialog-title">
      <DialogTitle id="genre-dialog-title">{genre.name}</DialogTitle>
      <DialogContent>
        <Typography>{genre.description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenrePopup;
