import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { on } from 'events';

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
        const response = await axios.post('http://localhost:3001/auth/google/sign-in', {
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
    <div>
      <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </div>
  );
};

export default GoogleLoginButton;
