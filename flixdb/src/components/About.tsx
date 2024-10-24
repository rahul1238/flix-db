import React from 'react';
import { Typography, Container, Paper } from '@mui/material';

const About: React.FC = () => {
    return (
        <Container maxWidth="md" sx={{ paddingTop: 4 }}>
            <Paper elevation={3} sx={{ padding: 4, backgroundColor: '#2c2c2c', color: '#fff' }}>
                <Typography variant="h4" gutterBottom>
                    About FLiXDB
                </Typography>
                <Typography variant="body1" paragraph>
                    FLiXDB is a comprehensive movie database that allows you to explore and track your favorite movies, TV shows, and actors. Much like IMDb, we provide detailed information about movie releases, cast, crew, and much more.
                </Typography>
                <Typography variant="body1" paragraph>
                    Whether you are a film enthusiast, a casual viewer, or an aspiring filmmaker, FLiXDB is the perfect place to discover, learn, and contribute to the world of cinema. Our platform is designed to be user-friendly, informative, and constantly updated to ensure you stay connected with the latest in entertainment.
                </Typography>
                <Typography variant="body1" paragraph>
                    The developer of FLiXDB is Rahul Kumar, who is dedicated to providing a seamless experience for all users. If you have any queries or would like to get in touch, feel free to reach out via email.
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Developer Contact: <strong>rahul.kumar@example.com</strong>
                </Typography>
            </Paper>
        </Container>
    );
};

export default About;
