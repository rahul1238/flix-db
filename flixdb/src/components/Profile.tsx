import React from "react";
import { Container, Typography, Box, Avatar } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Profile: React.FC = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn || !user) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">No user details available. Please log in.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
          {user.name ? user.name.charAt(0) : 'U'}
        </Avatar>
        <Typography variant="h4">{user.name }</Typography>
      </Box>
      <Typography variant="h6">Username: {user.username }</Typography>
      <Typography variant="h6">Mobile: {user.mobile }</Typography>
      <Typography variant="h6">Email: {user.email }</Typography>
      <Typography variant="h6">Role: {user.role }</Typography>
    </Container>
  );
};

export default Profile;
