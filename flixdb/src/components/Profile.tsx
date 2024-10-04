import React, { useState } from 'react';
import { Container, Typography, Box, Avatar, TextField, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    role: user?.role || '',
    avatar: user?.avatar || '', 
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  if (!isLoggedIn || !user) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="textSecondary">
          No user details available. Please log in.
        </Typography>
      </Container>
    );
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setProfileData({
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      role: user?.role || '',
      avatar: user?.avatar || '',
    });
    setSelectedImage(null);
  };

  const handleSaveClick = () => {
    // Implement the logic to save the updated profile data (e.g., API call)
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{ width: 56, height: 56, mr: 2 }}
          src={selectedImage ? URL.createObjectURL(selectedImage) : profileData.avatar}
        >
          {!profileData.avatar && (user.name ? user.name.charAt(0) : user.username.charAt(0).toUpperCase() || 'U')}
        </Avatar>
        {isEditing ? (
          <TextField
            label="Name"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            fullWidth
          />
        ) : (
          <Typography variant="h4">{profileData.name || profileData.username}</Typography>
        )}
      </Box>
      
      {isEditing ? (
        <>
          <TextField
            label="Username"
            name="username"
            value={profileData.username}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Mobile"
            name="mobile"
            value={profileData.mobile}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Role"
            name="role"
            value={profileData.role}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <input
            accept="image/*"
            type="file"
            onChange={handleImageChange}
            style={{ marginBottom: 16 }}
          />
          <Box>
            <Button variant="contained" color="primary" onClick={handleSaveClick} sx={{ mr: 2 }}>
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancelClick}>
              Cancel
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h6">Username: {profileData.username}</Typography>
          {profileData.mobile && <Typography variant="h6">Mobile: {profileData.mobile}</Typography>}
          <Typography variant="h6">Email: {profileData.email}</Typography>
          <Typography variant="h6">Role: {profileData.role}</Typography>
          <Button variant="contained" onClick={handleEditClick} sx={{ mt: 2 }}>
            Edit Profile
          </Button>
        </>
      )}
    </Container>
  );
};

export default Profile;
