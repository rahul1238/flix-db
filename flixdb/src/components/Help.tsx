import React from 'react';
import { Typography, Container, Paper, Button } from '@mui/material';

const Help: React.FC = () => {
    const handleContactClick = () => {
        alert('Please contact the developer at: rahul.kumar@example.com');
    };

    return (
        <Container maxWidth="sm" sx={{ paddingTop: 4 }}>
            <Paper elevation={3} sx={{ padding: 4, backgroundColor: '#2c2c2c', color: '#fff' }}>
                <Typography variant="h4" gutterBottom>
                    Need Help?
                </Typography>
                <Typography variant="body1" paragraph>
                    If you need any assistance or have any questions regarding FLiXDB, we`&apos;`re here to help! Feel free to reach out to us.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleContactClick}>
                    Contact Developer
                </Button>
            </Paper>
        </Container>
    );
};

export default Help;
