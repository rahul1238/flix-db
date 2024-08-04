import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface LoginFormProps {
  open: boolean;
  onClose: () => void;
  onSignupOpen: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ open, onClose, onSignupOpen }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', { email: formData.email, password: formData.password });
      const { accessToken } = response.data;
      login(accessToken); 
      setFormData({ email: '', password: '' }); 
      setError(null);
      onClose();
      navigate('/');
    } catch (error) {
      setError('Invalid email or password');
      console.error('Error logging in:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Login</DialogTitle>
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
        />
        <TextField
          margin="dense"
          id="password"
          label="Password"
          type="password"
          fullWidth
          variant="standard"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Button onClick={handleLogin} variant="contained" color="primary">Login</Button>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Don't have an account? <span style={{ cursor: 'pointer', color: 'blue' }} onClick={onSignupOpen}>Sign Up</span>
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default LoginForm;
