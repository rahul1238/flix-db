import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Container, Snackbar, Menu, MenuItem, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Menu as MenuIcon, AccountCircle as AccountCircleIcon, Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext';
import { useTheme } from '@mui/material/styles';
import logo from '../assets/logo.png';
import SearchBar from './SearchBar';
import LoginForm from '../forms/LoginForm';
import SignupForm from '../forms/SignupForm';

const Header: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState<null | HTMLElement>(null);

  const { isLoggedIn, logout, user } = useAuth();
  const theme = useTheme();
  const { toggleColorMode } = useThemeContext();

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);
  const handleSignupOpen = () => setSignupOpen(true);
  const handleSignupClose = () => setSignupOpen(false);
  const handleSearchIconClick = () => setShowSearchBar((prev) => !prev);
  const handleSignupSuccess = (message: string) => setSuccessMessage(message);
  const handleSnackbarClose = () => setSuccessMessage(null);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);
  const handleProfileMenuClick = (event: React.MouseEvent<HTMLElement>) => setProfileMenuAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setProfileMenuAnchorEl(null);

  return (
    <AppBar position="static" color="default">
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={handleMenuClick} aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
              {isLoggedIn && (user?.role === 'admin' || user?.role === 'promoter') && (
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
              sx={{ textDecoration: 'none', color: theme.palette.text.primary, fontWeight: 'bold' }}
            >
              FLiX<span style={{ color: '#FF0000' }}>DB</span>
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: showSearchBar ? '300px' : 'auto', transition: 'width 0.3s ease-in-out' }}>
              {showSearchBar && <SearchBar onMovieClick={() => setShowSearchBar(false)} />}
              <IconButton color="inherit" onClick={handleSearchIconClick} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Box>
            {isLoggedIn ? (
              <>
                <IconButton color="inherit" onClick={handleProfileMenuClick} aria-label="profile">
                  {user?.avatar ? (
                    <Avatar
                      src={user.avatar}
                      alt={user.username}
                      sx={{ width: 24, height: 24 }}
                    />
                  ) : (
                    <AccountCircleIcon sx={{ fontSize: 24 }} />  
                  )}
                </IconButton>
                <Menu
                  anchorEl={profileMenuAnchorEl}
                  open={Boolean(profileMenuAnchorEl)}
                  onClose={handleProfileMenuClose}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleProfileMenuClose}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { logout(); handleProfileMenuClose(); }}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" onClick={handleLoginOpen}>
                Login
              </Button>
            )}
            <IconButton color="inherit" onClick={toggleColorMode} aria-label="toggle theme">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      <LoginForm open={loginOpen} onClose={handleLoginClose} onSignupOpen={handleSignupOpen} />
      <SignupForm open={signupOpen} onClose={handleSignupClose} onSignupSuccess={handleSignupSuccess} />
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={successMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </AppBar>
  );
};

export default Header;
