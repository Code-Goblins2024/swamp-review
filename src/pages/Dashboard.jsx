import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, Button, Chip, CircularProgress } from '@mui/joy';
import { Favorite as FavoriteIcon, Apartment as ApartmentIcon, StarRateRounded as RatingIcon } from '@mui/icons-material';
import supabase from '../config/supabaseClient';
import useAuth from '../store/authStore';

const DormCard = ({ name, rating, image }) => (
  <Card variant="outlined" sx={{
    width: 200,
    mr: 2,
    cursor: 'pointer',
    transition: 'all 0.3s',
    '&:hover': {
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
    },
  }}>
    <CardContent>
      {/* <img src={image} alt={name} style={{ width: '100%', height: 100, objectFit: 'cover' }} /> */}
      <Box sx={{ display: 'flex', alignItems: 'top', mt: 0 }}>
        <ApartmentIcon sx={{ fontSize: 50 }} />
        <FavoriteIcon color="error" sx={{ ml: 'auto' }} />
      </Box>
      <Typography level="title-md">{name}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
        {/* <Typography level="body-sm">{rating}/5</Typography> */}
        <RatingIcon sx={{ color: '#FFD700', mr: 0.5 }} />
        <Typography level="body-sm">5.0</Typography>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    await Promise.all([
      fetchFavorites(),
      fetchRecommendations(),
      fetchRecentReviews()
    ]);
    setLoading(false);
  };

  const fetchFavorites = async () => {
    try {
      // const { data, error } = await supabase
      //   .from('favorites')
      //   .select(`
      //     housingId,
      //     housing:housingId(id, name, rating, image)
      //   `)
      //   .eq('userId', session.user.id)
      //   .limit(5);
      const { data, error } = await supabase
        .from('housing')
        .select('*')
        .limit(3);
      console.log(data);

      if (error) throw error;
      // setFavorites(data.map(item => item.housing));
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('housing')
        .select('*')
        .limit(3);

      if (error) throw error;
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    }
  };

  const fetchRecentReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          content,
          rating,
          created_at,
          housing:housingId(name)
        `)
        .eq('userId', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentReviews(data);
    } catch (error) {
      console.error('Error fetching recent reviews:', error);
      setRecentReviews([]);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography level="h2" sx={{ mb: 3 }}>Dashboard</Typography>

      <Box sx={{ mb: 4 }}>
        <Typography level="h3" sx={{ mb: 2 }}>Your Favorites</Typography>
        <Box sx={{ display: 'flex', overflowX: 'auto', pb: 2 }}>
          {favorites.length > 0 ? (
            favorites.map((dorm) => (
              <DormCard key={dorm.id} name={dorm.name} />
            ))
          ) : (
            <Typography level="body-md">No favorites found. Start exploring dorms to add some!</Typography>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography level="h4" sx={{ mb: 2 }}>Recommended for You</Typography>
              {recommendations.length > 0 ? (
                recommendations.map((dorm) => (
                  <Box key={dorm.id} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: '#DDDDDD',
                    },
                  }}>
                    <ApartmentIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography level="title-sm">{dorm.name}</Typography>
                      <Typography level="body-sm">{dorm.description}</Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography level="body-md">No recommendations available at the moment.</Typography>
              )}
              {recommendations.length > 0 && (
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/search')}
                >
                  See More Housing Options
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography level="h4" sx={{ mb: 2 }}>Your Recent Reviews</Typography>
              {recentReviews.length > 0 ? (
                recentReviews.map((review) => (
                  <Box key={review.id} sx={{ mb: 2 }}>
                    <Typography level="title-sm">{review.housing.name}</Typography>
                    <Typography level="body-sm">{review.content.substring(0, 100)}...</Typography>
                    <Chip size="sm" variant="outlined" sx={{ mt: 1 }}>{review.rating}/5</Chip>
                  </Box>
                ))
              ) : (
                <Typography level="body-md">No recent reviews. Share your experiences by writing a review!</Typography>
              )}
              {recentReviews.length > 0 && (
                <Button fullWidth variant="outlined" sx={{ mt: 2 }}>View All Your Reviews</Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;