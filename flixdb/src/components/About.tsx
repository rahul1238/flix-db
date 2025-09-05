import React from 'react';
import { Typography, Container, Paper, List, ListItem, ListItemText, Divider, Stack } from '@mui/material';
import PageIntro from './PageIntro';

const About: React.FC = () => {
    return (
                <Container maxWidth="md" sx={{ paddingTop: 4 }}>
                        <PageIntro
                            title="About FlixDB"
                            subtitle="Building a modern, community‑aware film index"
                            paragraphs={[
                                'FlixDB aims to streamline how enthusiasts, promoters and casual viewers discover screen content. We focus on clarity, speed and trustworthy contributions over ad clutter.',
                                'Every feature is shaped by real usage: from lightweight submission flows for promoters to clean reading experiences for audiences.'
                            ]}
                            dense
                        />
                        <Paper elevation={3} sx={{ p:4, borderRadius:4 }}>
                            <Stack spacing={3}>
                                <div>
                                    <Typography variant="h5" gutterBottom fontWeight={600}>Core Principles</Typography>
                                    <List dense>
                                        <ListItem><ListItemText primary="Accuracy first – metadata moderation and future version history." /></ListItem>
                                        <ListItem><ListItemText primary="Performance – fast, distraction‑free browsing on any device." /></ListItem>
                                        <ListItem><ListItemText primary="Community trust – transparent promoter roles and authentic reviews." /></ListItem>
                                        <ListItem><ListItemText primary="Extensibility – architecture prepared for cast, crew & streaming availability." /></ListItem>
                                    </List>
                                </div>
                                <Divider />
                                <div>
                                    <Typography variant="h5" gutterBottom fontWeight={600}>Upcoming Roadmap</Typography>
                                    <List dense>
                                        <ListItem><ListItemText primary="Advanced search & filtering (genre, year, rating)." /></ListItem>
                                        <ListItem><ListItemText primary="User watchlists & follow features." /></ListItem>
                                        <ListItem><ListItemText primary="Episode & season structuring for series." /></ListItem>
                                        <ListItem><ListItemText primary="Review quality signals & abuse prevention." /></ListItem>
                                    </List>
                                </div>
                                <Divider />
                                <Typography variant="body2">Developer Contact: <strong>rahul.kumar@example.com</strong></Typography>
                            </Stack>
                        </Paper>
                </Container>
    );
};

export default About;
