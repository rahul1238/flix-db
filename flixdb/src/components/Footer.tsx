import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ py: 2, textAlign: 'center', backgroundColor: '#f1f1f1', mt: 'auto' }}>
      <Typography variant="body2" color="textSecondary">
        © 2024 FlixDB
      </Typography>
    </Box>
  );
};

export default Footer;
