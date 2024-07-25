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
  if (!genre) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{genre.name}</DialogTitle>
      <DialogContent>
        <Typography>{genre.description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenrePopup;
