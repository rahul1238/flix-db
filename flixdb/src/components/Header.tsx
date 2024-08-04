import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Container,
  Snackbar,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from "../context/AuthContext";
import { useThemeContext } from '../context/ThemeContext';
import { useTheme } from '@mui/material/styles';
import logo from '../assets/logo.png';
import SearchBar from "./SearchBar";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const Header: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isLoggedIn, logout, user } = useAuth();
  const theme = useTheme();
  const { toggleColorMode } = useThemeContext();

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  const handleSignupOpen = () => setSignupOpen(true);
  const handleSignupClose = () => setSignupOpen(false);

  const handleSearchIconClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  const handleSignupSuccess = (message: string) => {
    setSuccessMessage(message);
  };

  const handleSnackbarClose = () => {
    setSuccessMessage(null);
  };

  const handleMovieClick = () => {
    setShowSearchBar(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="default">
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit" onClick={handleMenuClick}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {isLoggedIn && (user?.role === "admin" || user?.role === "promoter") && (
                <MenuItem component={Link} to="/mymovies" onClick={handleMenuClose}>
                  My Movies
                </MenuItem>
              )}
            </Menu>
            <img src={logo} alt="FlixDB Logo" style={{ height: 40, marginRight: 10 }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ textDecoration: "none", color:theme.palette.mode==='dark'?"#FFFFFF": "#000000", fontWeight: "bold" }}
            >
              FLiX
              <span style={{ color: "#FF0000" }}>DB</span>
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", width: showSearchBar ? '300px' : 'auto', transition: 'width 0.3s ease-in-out' }}>
              {showSearchBar && (
                <SearchBar onMovieClick={handleMovieClick} />
              )}
              <IconButton color="inherit" onClick={handleSearchIconClick}>
                <SearchIcon />
              </IconButton>
            </Box>
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
              {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
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
