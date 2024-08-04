import React from 'react';
import { Box, Typography } from '@mui/material';
import {useTheme} from '@mui/material';

const Footer: React.FC = () => {
  const theme=useTheme();
  return (
    <Box component="footer" sx={{ py: 2, textAlign: 'center', backgroundColor:theme.palette.mode==='dark'? '#1a1a1a':'#f1f1f1', mt: 'auto' }}>
      <Typography variant="body2" color="textSecondary">
        © 2024 FlixDB
      </Typography>
    </Box>
  );
};

export default Footer;
