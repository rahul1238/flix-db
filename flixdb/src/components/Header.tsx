import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Snackbar,
  IconButton,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useAuth } from "../context/AuthContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../context/ThemeContext';
import { useTheme } from '@mui/material/styles';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const { isLoggedIn, logout } = useAuth();
  const theme = useTheme();
  const { toggleColorMode } = useThemeContext();

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  const handleSignupOpen = () => setSignupOpen(true);
  const handleSignupClose = () => setSignupOpen(false);

  const handleSignupSuccess = (message: string) => {
    setSuccessMessage(message);
  };

  const handleSnackbarClose = () => {
    setSuccessMessage(null);
  };

  const handleSearchIconClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  const handleMovieClick = () => {
    setShowSearchBar(false);
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ minHeight: '64px' }}>
      <Container maxWidth='xl'>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="FlixDB Logo" style={{ height: 40, marginRight: 10 }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ textDecoration: "none", color: "#000000", fontWeight: 'bold' }}
            >
              FLiX
              <span style={{ color: "#FF0000" }}>DB</span>
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Button component={Link} to="/" color="inherit">Home</Button>
            <Button component={Link} to="/about" color="inherit">About Us</Button>
            <Button component={Link} to="/contact" color="inherit">Contact Us</Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
            <IconButton color="inherit" onClick={handleSearchIconClick}>
              <SearchIcon />
            </IconButton>
            {showSearchBar && <SearchBar onMovieClick={handleMovieClick} />}
            {isLoggedIn ? (
              <>
                <IconButton color="inherit" component={Link} to="/profile">
                  <AccountCircleIcon />
                </IconButton>
                <IconButton color="inherit" onClick={logout}>
                  <ExitToAppIcon />
                </IconButton>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={handleLoginOpen}>
                  Login
                </Button>
              </>
            )}
            <IconButton color="inherit" onClick={toggleColorMode}>
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      <LoginForm open={loginOpen} onClose={handleLoginClose} onSignupOpen={handleSignupOpen} />
      <SignupForm
        open={signupOpen}
        onClose={handleSignupClose}
        onSignupSuccess={handleSignupSuccess}
      />
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={successMessage}
      />
    </AppBar>
  );
};

export default Header;
