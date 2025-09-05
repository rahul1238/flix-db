import React from 'react';
import { Box, Typography, Paper, Stack, Divider } from '@mui/material';

interface PageIntroProps {
  title: string;
  subtitle?: string;
  paragraphs?: string[];
  children?: React.ReactNode;
  dense?: boolean;
}

/** Reusable introductory block for pages – purely presentational. */
const PageIntro: React.FC<PageIntroProps> = ({ title, subtitle, paragraphs = [], children, dense }) => {
  return (
    <Paper elevation={4} sx={{ p: { xs: 2.5, md: dense ? 3 : 4 }, mb: dense ? 3 : 5, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position:'absolute', inset:0, background:(t)=> t.palette.mode==='dark' ? 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0))' : 'linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0))', pointerEvents:'none' }} />
      <Stack spacing={2} sx={{ position:'relative' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ fontSize:{ xs:26, md:34 } }}>{title}</Typography>
          {subtitle && (
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: .5 }}>{subtitle}</Typography>
          )}
        </Box>
        {paragraphs.map((p, i) => (
          <Typography key={i} variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>{p}</Typography>
        ))}
        {children && (
          <>
            {(paragraphs.length>0) && <Divider sx={{ my: 1 }} />}
            <Box>{children}</Box>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default PageIntro;
