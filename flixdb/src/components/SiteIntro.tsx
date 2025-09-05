import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';

/**
 * SiteIntro
 * Lightweight descriptive section to give users context while the catalog is still sparse.
 * Purely presentational – no side‑effects or props so it won't impact existing logic.
 */
const SiteIntro: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, mb: 5 }}>      
      <Stack spacing={2}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ fontSize: { xs: 26, md: 34 } }}>
          Welcome to FlixDB
        </Typography>
        <Typography variant="body1" color="text.secondary">
          FlixDB is your collaborative space to catalogue, discover and discuss films, series and documentaries. 
          Create an account to promote new titles, curate personal watchlists, and share thoughtful reviews with the community.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          As the library grows you will see richer artwork, deeper metadata and community insights surface here. For now, enjoy a curated
          starter set of titles as we continue to expand the collection. Click any card to view details, genres, promoters and community feedback.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ready to contribute? Head to the upload page to add a new title or sign in to leave your first review. Your participation helps shape a more
          useful and trustworthy film database for everyone.
        </Typography>
      </Stack>
    </Paper>
  );
};

export default SiteIntro;
