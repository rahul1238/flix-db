import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        textAlign: 'center',
        backgroundColor: isDarkMode ? theme.palette.grey[900] : theme.palette.grey[200],
        mt: 'auto',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © 2024 FlixDB
      </Typography>
    </Box>
  );
};

export default Footer;
