import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import PageIntro from '../components/PageIntro';
import { api } from '../utils/api';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Token is missing in the URL.');
    }
  }, [location]);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess('Password has been reset successfully. You can now log in.');
      navigate('/');
    } catch (err) {
      setError( 'Error resetting password. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', mt: 4 }}>
      <PageIntro
        title="Reset Password"
        subtitle="Secure your account with a fresh credential"
        paragraphs={[
          'Passwords should be at least 8 characters and avoid easily guessed phrases. A unique passphrase improves security across platforms.',
          'After a successful reset you will be redirected to the home page and can log in again immediately.'
        ]}
        dense
      />
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <TextField
        label="New Password"
        type="password"
        fullWidth
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleResetPassword}>
        Reset Password
      </Button>
    </Box>
  );
};

export default ResetPassword;
