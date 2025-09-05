import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface GoogleLoginButtonProps {
  onClose: () => void;
}

const GoogleLoginButton:React.FC<GoogleLoginButtonProps> = ({ onClose }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse && credentialResponse.credential) {
      try {
        const response = await api.post('/auth/google/sign-in', {
          token: credentialResponse.credential,
        });

        if (response.data.success && response.data.data?.accessToken) {
          login(response.data.data.accessToken);
          setSuccessMessage('Login successful!');
          onClose();
          navigate('/');
        } else {
          setErrorMessage(response.data.message || 'Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Login failed:', error);
        setErrorMessage('Login failed. Please try again.');
      }
    } else {
      console.error('Invalid response from Google login');
      setErrorMessage('Invalid response from Google login');
    }
  };

  const handleLoginError = () => {
    console.error('Login Failed');
    setErrorMessage('Login Failed. Please try again.');
  };

  return (
    <Box>
      <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
      {successMessage && (
        <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>{successMessage}</Typography>
      )}
      {errorMessage && (
        <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>{errorMessage}</Typography>
      )}
    </Box>
  );
};

export default GoogleLoginButton;
