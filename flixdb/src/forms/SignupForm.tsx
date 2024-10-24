import React, { useState } from 'react';
import {Dialog,DialogTitle,DialogContent,TextField,DialogActions,Button,Typography,MenuItem,Select,FormControl,InputLabel,IconButton,InputAdornment} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface SignupFormProps {
  open: boolean;
  onClose: () => void;
  onSignupSuccess: (message: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ open, onClose, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    phone: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));

    if (id === 'confirmPassword' || id === 'password') {
      setError(null);
    }
  };

  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    setFormData((prevFormData) => ({ ...prevFormData, role: e.target.value as string }));
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/users', {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });
      console.log('User signed up:', response.data);
      onSignupSuccess('User signed up successfully! Please log in.');
      setFormData({ username: '', name: '', email: '', password: '', confirmPassword: '', role: '', phone: '' });
      setError(null);
      onClose();
      navigate('/');
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Error signing up. Please try again.');
      } else {
        setError('Unexpected error occurred. Please try again.');
      }
      console.error('Error signing up:', error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="signup-dialog-title">
      <DialogTitle id="signup-dialog-title">Sign Up</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="Username"
          type="text"
          fullWidth
          variant="standard"
          value={formData.username}
          onChange={handleChange}
          required
          inputProps={{ 'aria-label': 'username' }}
        />
        <TextField
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          value={formData.name}
          onChange={handleChange}
          required
          inputProps={{ 'aria-label': 'name' }}
        />
        <TextField
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
          value={formData.email}
          onChange={handleChange}
          required
          inputProps={{ 'aria-label': 'email' }}
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
        <TextField
          margin="dense"
          id="confirmPassword"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          variant="standard"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          inputProps={{ 'aria-label': 'confirm password' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="dense"
          id="phone"
          label="Phone"
          type="tel"
          fullWidth
          variant="standard"
          value={formData.phone}
          onChange={handleChange}
          required
          inputProps={{ 'aria-label': 'phone' }}
        />
        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel id="role-label" shrink>
            Role
          </InputLabel>
          <Select
            labelId="role-label"
            id="role"
            value={formData.role}
            onChange={handleRoleChange}
            required
            inputProps={{ 'aria-label': 'role' }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              <em>Select Role</em>
            </MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="promoter">Promoter</MenuItem>
          </Select>
        </FormControl>
        {error && <Typography color="error" role="alert">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSignup} variant="contained" color="primary">
          Sign Up
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignupForm;
