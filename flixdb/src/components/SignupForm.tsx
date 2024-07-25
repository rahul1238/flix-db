import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SignupFormProps {
  open: boolean;
  onClose: () => void;
  onSignupSuccess: (message: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ open, onClose, onSignupSuccess }) => {
  const [formData, setFormData] = useState({ username: '', name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
  };

  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    setFormData((prevFormData) => ({ ...prevFormData, role: e.target.value as string }));
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/users', { 
        username: formData.username, 
        name: formData.name, 
        email: formData.email, 
        password: formData.password, 
        role: formData.role 
      });
      console.log("User signed up:", response.data); // Debugging log
      onSignupSuccess('User signed up successfully! Please log in.');
      setFormData({ username: '', name: '', email: '', password: '', role: 'user' }); 
      setError(null); // Clear error
      onClose();
      navigate('/');
    } catch (error) {
      setError('Error signing up. Please try again.');
      console.error('Error signing up:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sign Up</DialogTitle>
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
        <FormControl fullWidth margin="dense">
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            id="role"
            value={formData.role}
            onChange={handleRoleChange}
            required
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="promoter">Promoter</MenuItem>
          </Select>
        </FormControl>
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSignup}>Sign Up</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignupForm;
