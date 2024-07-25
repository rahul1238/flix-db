import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Avatar } from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface User {
  email: string;
  sub: number;
  role: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Token:", token);
        const response = await axios.get("http://localhost:3001/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn]);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">No user details available.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar sx={{ width: 56, height: 56, mr: 2 }}>{user.email.charAt(0)}</Avatar>
        <Typography variant="h4">{user.email}</Typography>
      </Box>
      <Typography variant="h6">User ID: {user.sub}</Typography>
      <Typography variant="h6">Email: {user.email}</Typography>
      <Typography variant="h6">Role: {user.role}</Typography>
    </Container>
  );
};

export default Profile;
