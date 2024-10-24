import React from 'react';
import {Box,Avatar,Typography,Divider,List,ListItem,ListItemIcon,ListItemText,} from '@mui/material';
import { Home, Movie, Info, Help, AdminPanelSettings } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from "@mui/material/styles";

const NavBar: React.FC = () => {
    const { isLoggedIn, user } = useAuth();
    const theme = useTheme();

    return (
        <Box
            sx={{
                width: '250px',
                backgroundColor: theme.palette.mode === "dark" ? "#1c1c1e" : "#fff",
                color: 'white',
                height: '100vh',
                paddingTop: '20px',
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {isLoggedIn && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 4,
                    }}
                >
                    <Avatar
                        alt={user?.name}
                        src={user?.avatar}
                        sx={{ width: 80, height: 80, mb: 2 }}
                    />
                    <Typography variant="h6">{user?.name}</Typography>
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                        {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown Role'}
                    </Typography>

                </Box>
            )}

            <Divider sx={{ width: '80%', backgroundColor: 'gray', mb: 2 }} />

            <List
                sx={{
                    width: '100%',
                    '& .MuiListItem-root:hover': {
                        backgroundColor: 'secondary.light',
                    },
                }}
            >
                <ListItem button component={Link} to="/">
                    <ListItemIcon>
                        <Home sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Home" sx={{ color: 'white' }} />
                </ListItem>

                <ListItem button component={Link} to="/mymovies">
                    <ListItemIcon>
                        <Movie sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="My Movies" sx={{ color: 'white' }} />
                </ListItem>

                <ListItem button component={Link} to="/about">
                    <ListItemIcon>
                        <Info sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="About" sx={{ color: 'white' }} />
                </ListItem>

                <ListItem button component={Link} to="/help">
                    <ListItemIcon>
                        <Help sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Help" sx={{ color: 'white' }} />
                </ListItem>

                {isLoggedIn && user?.role === 'admin' && (
                    <ListItem button component={Link} to="/admin">
                        <ListItemIcon>
                            <AdminPanelSettings sx={{ color: 'white' }} />
                        </ListItemIcon>
                        <ListItemText primary="Admin" sx={{ color: 'white' }} />
                    </ListItem>
                )}
            </List>
        </Box>
    );
};

export default NavBar;
