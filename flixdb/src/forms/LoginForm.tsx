import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Typography, Box, IconButton, InputAdornment, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ForgotPasswordDialog from '../components/ForgotPasswordDialog';
import GoogleLoginButton from '../components/GoogleLoginButton';

interface LoginFormProps {
  open: boolean;
  onClose: () => void;
  onSignupOpen: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ open, onClose, onSignupOpen }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', formData);
      const accessToken: string = response.data.data.accessToken;
      login(accessToken);
      setFormData({ email: '', password: '' });
      setError(null);
      onClose();
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data?.message || 'Invalid email or password');
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error logging in:', error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby="login-dialog-title">
        <DialogTitle id="login-dialog-title">Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={formData.email}
            onChange={handleChange}
            required
            inputProps={{ 'aria-label': 'email address' }}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="standard"
            value={formData.password}
            onChange={handleChange}
            required
            inputProps={{ 'aria-label': 'password' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && <Typography color="error" role="alert">{error}</Typography>}
          <Typography
            variant="body2"
            color="primary"
            sx={{ mt: 2, cursor: 'pointer' }}
            onClick={handleForgotPasswordOpen}
          >
            Forgot Password?
          </Typography>
          <Box mt={2}>
            <GoogleLoginButton />
          </Box>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Button onClick={handleLogin} variant="contained" color="primary">
            Login
          </Button>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Don&apos;t have an account?{' '}
              <span
                style={{ cursor: 'pointer', color: 'blue' }}
                onClick={onSignupOpen}
                role="button"
                aria-label="open signup form"
              >
                Sign Up
              </span>
            </Typography>
          </Box>
        </DialogActions>
      </Dialog>

      <ForgotPasswordDialog open={forgotPasswordOpen} onClose={handleForgotPasswordClose} />
    </>
  );
};

export default LoginForm;
