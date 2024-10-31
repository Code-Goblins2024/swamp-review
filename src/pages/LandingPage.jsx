import { Box, Typography, Button, Card, CardContent, Grid, Sheet } from '@mui/joy';
import { Search as SearchIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllHousing } from '../functions/housingQueries';

const FeatureCard = ({ icon, title, description }) => (
  <Card variant="outlined">
    <CardContent sx={{ textAlign: 'center' }}>
      <Box sx={{ mb: 2 }}>{icon}</Box>
      <Typography level="h4" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography level="body-md">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    hallCount: 0,
    reviewCount: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const housingData = await getAllHousing();

      const hallCount = housingData.length;

      const reviewCount = housingData.reduce((total, dorm) => {
        return total + (dorm.reviews?.length || 0);
      }, 0);

      setStats({ hallCount, reviewCount });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      title: "Easy Search",
      description: "Find your perfect dorm with our intuitive search filters - by location, price, or amenities."
    },
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      title: "Lorem Ipsum",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, consequat nibh."
    },
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      title: "Lorem Ipsum",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, consequat nibh."
    },
  ];

  return (
    <Box>
      <Sheet
        variant="solid"
        color="primary"
        invertedColors
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          height: '70vh',
          backgroundImage: 'linear-gradient(rgba(0, 30, 60, 0.8), rgba(0, 30, 60, 0.8)), url("/api/placeholder/1200/800")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <img src="/swamp_review_logo.png" style={{ height: "8rem", marginBottom: "2px" }} alt="Swamp Review Logo" />
        <Typography
          level="h1"
          sx={{
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          Find Your Home at UF
        </Typography>
        <Typography
          level="h3"
          sx={{
            mb: 4,
            maxWidth: '800px',
            fontSize: { xs: '1.2rem', md: '1.5rem' },
          }}
        >
          Discover and compare on-campus housing options at the University of Florida
        </Typography>
        <Button
          size="lg"
          onClick={() => navigate('/search')}
          startDecorator={<SearchIcon />}
        >
          Start Your Search
        </Button>
      </Sheet>

      <Box sx={{ py: 8, px: 4 }}>
        <Typography
          level="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
          }}
        >
          Why Choose Our Platform?
        </Typography>
        <Grid
          container
          spacing={4}
          sx={{
            maxWidth: 1200,
            margin: '0 auto',
          }}
        >
          {features.map((feature, index) => (
            <Grid key={index} xs={12} md={4}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Sheet
        variant="soft"
        sx={{
          textAlign: 'center',
          py: 8,
          px: 4,
        }}
      >
        <Typography level="h2" sx={{ mb: 2 }}>
          Ready to Find Your New Home?
        </Typography>
        <Typography level="body-lg">
          Join thousands of UF students who found their perfect on-campus home
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            py: 4,
            px: 4,
            gap: { xs: 4, md: 8 },
          }}
        >
          {[
            { number: stats.hallCount, label: "Residence Halls" },
            { number: stats.reviewCount, label: "Total Reviews" },
          ].map((stat, index) => (
            <Box
              key={index}
              sx={{
                textAlign: 'center',
              }}
            >
              <Typography level="h1" color="primary">
                {stat.number}
              </Typography>
              <Typography level="body-lg">
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
        <Button
          size="lg"
          color="success"
          onClick={() => navigate('/signin')}
        >
          Get Started Now
        </Button>
      </Sheet>
    </Box>
  );
};

export default LandingPage;