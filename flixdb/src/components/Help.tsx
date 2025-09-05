import React from 'react';
import { Container, Button, Accordion, AccordionSummary, AccordionDetails, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PageIntro from './PageIntro';

const Help: React.FC = () => {
    const handleContactClick = () => {
        alert('Please contact the developer at: rahul.kumar@example.com');
    };

        return (
                <Container maxWidth="md" sx={{ paddingTop: 4 }}>
                        <PageIntro
                            title="Help Center"
                            subtitle="Answers & guidance for common actions"
                            paragraphs={[
                                'Browse the quick answers below. If your question is not covered, use the contact button to reach the developer directly.',
                                'We will expand this section with search and categorized topics as the platform evolves.'
                            ]}
                            dense
                        />
                        <Stack spacing={2}>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>How do I upload a new movie?</AccordionSummary>
                                <AccordionDetails>
                                    Navigate to the Upload page (must have promoter role). Complete required fields, attach poster images and submit. Missing genres can be created inline.
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Why can't I add a movie?</AccordionSummary>
                                <AccordionDetails>
                                    Only users with the promoter role can submit titles. Request an upgrade via support if you intend to contribute regularly.
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>How are featured titles chosen?</AccordionSummary>
                                <AccordionDetails>
                                    The homepage highlights a random eligible title each load. A curated editorial algorithm is planned.
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Can I edit a submitted title?</AccordionSummary>
                                <AccordionDetails>
                                    Edits by the original promoter will soon be versioned. For now, contact support for corrective updates.
                                </AccordionDetails>
                            </Accordion>
                            <Button variant="contained" color="primary" onClick={handleContactClick} sx={{ alignSelf:'flex-start' }}>
                                Contact Developer
                            </Button>
                        </Stack>
                </Container>
        );
};

export default Help;
