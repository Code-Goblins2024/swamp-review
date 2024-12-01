import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem } from '@mui/joy';
import { useTheme } from '@mui/joy/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: {
          xs: 2,
          sm: 3,
          md: 4
        },
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: {
            xs: '95%',
            sm: '80%',
            md: 650
          },
          padding: {
            xs: 1,
            sm: 2
          },
          marginTop: {
            xs: 4,
            sm: 8,
            md: 10
          }
        }}
      >
        <CardContent>
          <Typography
            level="h2"
            fontWeight="bold"
            textAlign="center"
            sx={{
              fontSize: {
                xs: '1.75rem',
                sm: '2rem'
              }
            }}
          >
            About Us
          </Typography>

          <Typography
            level="body1"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            Welcome to <span style={{ fontWeight: 'bold' }}>SwampReview</span>!
          </Typography>

          <Typography
            level="body1"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            We are dedicated to helping <span style={{ fontWeight: 'bold' }}>University of Florida</span> students
            find the perfect home on campus. Our goal is to simplify finding on-campus housing while allowing
            users to view and share reviews easily.
          </Typography>

          <Typography
            level="body1"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            <span style={{ fontWeight: 'bold' }}>Development Team:</span>
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <List
              orientation={isMobile ? 'vertical' : 'horizontal'}
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 1,
                padding: 1
              }}
            >
              <ListItem sx={{ justifyContent: 'center' }}>Evan Robinson</ListItem>
              <ListItem sx={{ justifyContent: 'center' }}>Jordan Sheehan</ListItem>
              <ListItem sx={{ justifyContent: 'center' }}>Vance Boudreau</ListItem>
              <ListItem sx={{ justifyContent: 'center' }}>Mike Pangas</ListItem>
            </List>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default About;