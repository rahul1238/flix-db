import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginButton = () => {
  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse && credentialResponse.credential) {
      try {
        const response = await axios.post('http://localhost:3001/auth/google', {
          token: credentialResponse.credential,
        });
        console.log('Login successful:', response.data);
      } catch (error) {
        console.error('Login failed:', error);
      }
    } else {
      console.error('Invalid response from Google login');
    }
  };

  const handleLoginError = () => {
    console.error('Login Failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={handleLoginError}
    />
  );
};

export default GoogleLoginButton;
