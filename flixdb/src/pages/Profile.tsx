import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Avatar, TextField, Button, IconButton, Dialog, DialogContent, CircularProgress, Card, Grid, Snackbar, Alert } from "@mui/material";
import PageIntro from "../components/PageIntro";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import { useNavContext } from "../context/NavContext";
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const theme = useTheme();
  const { drawerOpen } = useNavContext();

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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
        setSnackbarMessage("Profile updated successfully!");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage("Failed to update profile.");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbarMessage("An error occurred while updating profile.");
      setSnackbarSeverity("error");
    } finally {
      setIsEditing(false);
      setSnackbarOpen(true);
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

  const handleAvatarUpload = async () => {
    try {
      if (!selectedImage) return;

      const formData = new FormData();
      formData.append("avatar", selectedImage);

      const response = await axios.patch(
        `http://localhost:3001/api/users/${profileData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setProfileData((prevData) => ({
          ...prevData,
          avatar: response.data.avatar,
        }));
        setSelectedImage(null);
        setSnackbarMessage("Avatar uploaded successfully!");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage("Failed to upload avatar.");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setSnackbarMessage("An error occurred while uploading avatar.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleAvatarClick = () => {
    setOpenImageDialog(true);
  };

  const handleDialogClose = () => {
    setOpenImageDialog(false);
  };

  return (
    <Container className="container" sx={{ mt: 4, transform: drawerOpen ? 'translateX(240px)' : 'translateX(0)', transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1)', color: theme.palette.mode === "dark" ? "#fff" : "#000" }}>
      <PageIntro
        title="Your Profile"
        subtitle="Manage identity & personalization"
        paragraphs={[
          'Update your public information, adjust your display name and keep contact details current. An authentic profile increases trust when you promote titles or write reviews.',
          'Avatar changes appear immediately after upload. Roles determine available actions (e.g., promoters can submit new titles).'
        ]}
        dense
      />
      <Card
        sx={{
          p: 4,
          backgroundColor: theme.palette.mode === "dark" ? "#1c1c1e" : "#fff",
          borderRadius: "12px",
          boxShadow: 5,
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
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
                position: "relative",
                top: -40,
                backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#1c1c1e",
                boxShadow: 2,
                "&:hover": {
                  backgroundColor: theme.palette.mode === "dark" ? "#f0f0f0" : "#000",
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
            {selectedImage && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleAvatarUpload}
              >
                Upload Avatar
              </Button>
            )}
          </Grid>
          <Grid item xs={12} sm={8}>
            {isEditing ? (
              <>
                <TextField
                  label="Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
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
                  label="Phone"
                  name="phone"
                  value={profileData.phone}
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
                <Box sx={{ mt: 2 }}>
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
                    sx={{ ml: 2 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h6">{profileData.name}</Typography>
                <Typography variant="body1" sx={{ color: theme.palette.mode === "dark" ? "#ccc" : "#000" }}>
                  Username: {profileData.username}
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.mode === "dark" ? "#ccc" : "#000" }}>
                  Email: {profileData.email}
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.mode === "dark" ? "#ccc" : "#000" }}>
                  Phone: {profileData.phone}
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.mode === "dark" ? "#ccc" : "#000" }}>
                  Role: {profileData.role}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditClick}
                  sx={{ mt: 2 }}
                >
                  Edit Profile
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </Card>

      <Dialog open={openImageDialog} onClose={handleDialogClose}>
        <DialogContent>
          <Box
            component="img"
            src={ selectedImage ? URL.createObjectURL(selectedImage) : profileData.avatar }
            alt="Preview Avatar"
            sx={{ width:'100%', height:'auto', display:'block', borderRadius:1 }}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
