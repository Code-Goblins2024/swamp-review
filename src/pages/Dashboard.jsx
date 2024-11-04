import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, Button, Chip, CircularProgress } from '@mui/joy';
import { Apartment as ApartmentIcon } from '@mui/icons-material';
import supabase from '../config/supabaseClient';
import useAuth from '../store/authStore';
import { getUserFavorites } from "../functions/userQueries";
import DormCard from '../components/DormCard.jsx';

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

  const handleDormClick = (dormId) => {
    navigate(`/housing/${dormId}`);
  };

  const onFavoriteRemoved = async (housingId) => {
    try {
      const { data } = await supabase
        .from('favorites')
        .select()
        .eq('user_id', session.user.id)
        .eq('housing_id', housingId);

      if (data.length === 0) {
        setFavorites(favorites.filter(fav => fav.housing.id !== housingId));
      }
    } catch (error) {
      console.error('Error verifying favorite removal:', error);
    }
  };

  const fetchData = async () => {
    await Promise.all([
      fetchFavorites(),
      fetchRecommendations(),
      // fetchRecentReviews()
    ]);
    setLoading(false);
  };

  const fetchFavorites = async () => {
    try {
      const data = await getUserFavorites(session.user.id);
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
              <DormCard
                key={dorm?.housing?.id}
                name={dorm?.housing?.name}
                isFavorited={true}
                housingId={dorm?.housing?.id}
                onClick={() => handleDormClick(dorm?.housing?.id)}
                onFavoriteRemoved={onFavoriteRemoved}
              />
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