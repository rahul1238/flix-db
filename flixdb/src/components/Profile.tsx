import React, { useState, useEffect } from "react";
import {Container,Typography,Box,Avatar,TextField,Button,IconButton,Dialog,DialogContent,CircularProgress,} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import Cookies from "js-cookie";
import "./css/Profile.css";

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const [profileData, setProfileData] = useState({
    id: user?.id || 0,
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    avatar: user?.avatar || "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user || !user.id) {
          throw new Error("No User logged in.");
        }

        const response = await axios.get(
          `http://localhost:3001/api/users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        if (response.status === 200) {
          setProfileData(response.data.user);
        } else {
          throw new Error(
            `Failed to fetch profile data: ${response.statusText}`
          );
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn && user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, user]);

  if (!isLoggedIn || !user) {
    return (
      <Container className="container">
        <Typography variant="h6" color="textSecondary">
          No user details available. Please log in.
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="container">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="container">
        <Typography variant="h6" color="error">
          {error}
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
      id: user?.id || 0,
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role: user?.role || "",
      avatar: user?.avatar || "",
    });
    setSelectedImage(null);
  };

  const handleSaveClick = async () => {
    try {
      const formData = new FormData();

      formData.append("name", profileData.name);
      formData.append("username", profileData.username);
      formData.append("email", profileData.email);
      formData.append("phone", profileData.phone);
      formData.append("role", profileData.role);
      if (selectedImage) {
        formData.append("avatar", selectedImage);
      }

      const response = await axios.patch(
        `http://localhost:3001/api/users/${profileData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setProfileData(response.data);
      } else {
        console.error("Failed to update profile:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsEditing(false);
    }
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

  const handleAvatarClick = () => {
    setOpenImageDialog(true);
  };

  const handleDialogClose = () => {
    setOpenImageDialog(false);
  };

  return (
    <Container className="container">
      <Box
        className="avatar-box"
        sx={{
          position: "relative",
          display: "flex-start",
          justifyContent: "center",
          mb: 4,
          backgroundColor: theme.palette.mode === "dark" ? "black" : "white", // Dark mode handling
          p: 2,
          borderRadius: 2,
        }}
      >
        <Avatar
          src={
            selectedImage
              ? URL.createObjectURL(selectedImage)
              : profileData.avatar
          }
          alt={user.name}
          sx={{ width: 150, height: 150, boxShadow: 3, cursor: "pointer" }}
          onClick={handleAvatarClick}
        />
        <IconButton
          color="primary"
          component="label"
          sx={{
            position: "absolute",
            bottom: 0,
            right: "calc(50% - 24px)",
            backgroundColor: "white",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <PhotoCamera />
          <input
            accept="image/*"
            type="file"
            hidden
            onChange={handleImageChange}
          />
        </IconButton>
      </Box>

      <Dialog
        open={openImageDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <img
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : profileData.avatar
            }
            alt="Full Size Avatar"
            style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "8px" }}
          />
        </DialogContent>
      </Dialog>

      <Box mt={3}>
        <Typography variant="h5" mb={2}>
          Edit Profile
        </Typography>
        {isEditing ? (
          <>
            <Box mb={2}>
              <TextField
                label="Full Name"
                name="name"
                placeholder="Enter your name"
                value={profileData.name}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Username"
                name="username"
                placeholder="Enter your username"
                value={profileData.username}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Email"
                name="email"
                placeholder="Enter your email"
                value={profileData.email}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Phone"
                name="phone"
                placeholder="Enter your phone number"
                value={profileData.phone}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Role"
                name="role"
                placeholder="Enter your role"
                value={profileData.role}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>
            <Box className="button-group" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveClick}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancelClick}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="body1" mb={1}>
              Full Name: {profileData.name}
            </Typography>
            <Typography variant="body1" mb={1}>
              Username: {profileData.username}
            </Typography>
            <Typography variant="body1" mb={1}>
              Email: {profileData.email}
            </Typography>
            <Typography variant="body1" mb={1}>
              Phone: {profileData.phone}
            </Typography>
            <Typography variant="body1" mb={1}>
              Role: {profileData.role}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Profile;
