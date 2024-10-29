import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem } from '@mui/joy';

const About = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                padding: 2,
            }}
        >
            <Card variant="outlined" sx={{ maxWidth: 600, padding: 2, marginTop: 10 }}>
                <CardContent>
                    <Typography level="h2" fontWeight="bold" textAlign="center">
                        About Us
                    </Typography>
                    <Typography level="body1" textAlign="center" mt={2}>
                        Welcome to <span style={{ fontWeight: 'bold' }}>SwampReview</span>!
                    </Typography>
                    <Typography level="body1" textAlign="center" mt={2}>
                        We are dedicated to helping <span style={{ fontWeight: 'bold' }}>University of Florida</span> students find the perfect home on campus.
                    </Typography>
                    <Typography level="body1" textAlign="center" mt={2}>
                        Our goal is to simplify finding on-campus housing while allowing users to view and share reviews easily.
                    </Typography>
                    <Typography level="body1" textAlign="center" mt={2}>
                        <span style={{ fontWeight: 'bold' }}>Development Team:</span>
                    </Typography>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <List orientation='horizontal' >
                            <ListItem>Evan Robinson</ListItem>
                            <ListItem>Jordan Sheehan</ListItem>
                            <ListItem>Vance Boudreau</ListItem>
                            <ListItem>Mike Pangas</ListItem>
                        </List>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default About;