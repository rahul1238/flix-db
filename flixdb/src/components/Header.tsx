import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Container, Snackbar, Menu, MenuItem, Avatar, Drawer, List } from '@mui/material';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Menu as MenuIcon, AccountCircle as AccountCircleIcon, Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext';
import { useTheme } from '@mui/material/styles';
import { useNavContext } from '../context/NavContext';
import logo from '../assets/logo.png';
import SearchBar from './SearchBar';
import LoginForm from '../forms/LoginForm';
import SignupForm from '../forms/SignupForm';
import NavBar from './NavBar';

const Header: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState<null | HTMLElement>(null);

  const { isLoggedIn, logout, user } = useAuth();
  const theme = useTheme();
  const { toggleColorMode } = useThemeContext();
  const { drawerOpen, toggleDrawer } = useNavContext();

  const searchBarRef = useRef<HTMLDivElement>(null);

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);
  const handleSignupOpen = () => setSignupOpen(true);
  const handleSignupClose = () => setSignupOpen(false);
  const handleSearchIconClick = () => setShowSearchBar((prev) => !prev);
  const handleSignupSuccess = (message: string) => setSuccessMessage(message);
  const handleSnackbarClose = () => setSuccessMessage(null);
  const handleProfileMenuClick = (event: React.MouseEvent<HTMLElement>) => setProfileMenuAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setProfileMenuAnchorEl(null);

  // Close the search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSearchBar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <AppBar position="static" color="default">
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', transition: 'transform 0.3s ease-in-out', transform: drawerOpen ? 'translateX(250px)' : 'translateX(0)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" onClick={() => toggleDrawer(true)} aria-label="menu">
                <MenuIcon />
              </IconButton>
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
              {/* Search Bar */}
              <Box
                sx={{ display: 'flex', alignItems: 'center', width: showSearchBar ? '300px' : 'auto', transition: 'width 0.3s ease-in-out' }}
                ref={searchBarRef}
              >
                {showSearchBar && (
                  <SearchBar
                    onMovieClick={() => setShowSearchBar(false)}
                    onClose={() => setShowSearchBar(false)}
                  />
                )}
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
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
          onKeyDown={() => toggleDrawer(false)}
        >
          <List>
            <NavBar />
          </List>
        </Box>
      </Drawer>
      <LoginForm open={loginOpen} onClose={handleLoginClose} onSignupOpen={handleSignupOpen} />
      <SignupForm open={signupOpen} onClose={handleSignupClose} onSignupSuccess={handleSignupSuccess} />
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={successMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default Header;
