import React, { useState } from 'react';
import {Dialog,DialogTitle,DialogContent,TextField,DialogActions,Button,Typography,} from '@mui/material';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSendResetLink = async () => {
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('A password reset link has been sent to your email.');
      setError(null);
      navigate('/');
      onClose();
    } catch (err: unknown) {
      const anyErr = err as any;
      if (anyErr && anyErr.response) {
        setError(anyErr.response.data?.message || 'Failed to send reset link');
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error sending reset link:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="forgot-password-dialog-title">
      <DialogTitle id="forgot-password-dialog-title">Forgot Password</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
          value={email}
          onChange={handleEmailChange}
          required
          inputProps={{ 'aria-label': 'email address' }}
        />
        {message && <Typography color="primary">{message}</Typography>}
        {error && <Typography color="error" role="alert">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSendResetLink} variant="contained" color="primary">
          Send Reset Link
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
