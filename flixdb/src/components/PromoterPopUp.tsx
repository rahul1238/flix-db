import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface Promoter {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}

interface PromoterPopupProps {
  open: boolean;
  onClose: () => void;
  promoter: Promoter | null;
}

const PromoterPopup: React.FC<PromoterPopupProps> = ({ open, onClose, promoter }) => {
  if (!promoter) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{promoter.name}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">Username: {promoter.username}</Typography>
        <Typography variant="body1">Email: {promoter.email}</Typography>
        <Typography variant="body1">Role: {promoter.role}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromoterPopup;
