import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Stack, Card } from '@mui/joy';
import useAuth from '../store/authStore';
import ReviewMini from '../components/ReviewMini';
import { getUserReviews } from '../functions/reviewQueries';

const UserReviews = () => {
  const { session } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchReviews();
    }
  }, [session]);

  const fetchReviews = async () => {
    try {
      const data = await getUserReviews(session.user.id);
      const transformedReviews = data.map(review => ({
        ...review,
        user: {
          id: session.user.id,
          first_name: session.user.user_metadata?.first_name,
          last_name: session.user.user_metadata?.last_name,
          year: session.user.user_metadata?.year
        }
      }));
      setReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: { xs: "1rem", sm: "2rem", md: "3rem" } }}>
      <Stack useFlexGap spacing={4} sx={{ width: { xs: "100%", lg: "85%", xl: "70%" } }}>
        <Typography level="h2">Your Reviews</Typography>

        {reviews.length > 0 ? (
          <Card>
            <Stack spacing={2} sx={{ p: 2 }}>
              {reviews.map((review) => (
                <ReviewMini key={review.id} review={review} />
              ))}
            </Stack>
          </Card>
        ) : (
          <Card>
            <Typography
              level="body-lg"
              sx={{
                textAlign: 'center',
                color: 'neutral.500',
                py: 4
              }}
            >
              You haven't written any reviews yet. Start sharing your housing experiences!
            </Typography>
          </Card>
        )}
      </Stack>
    </Box>
  );
};

export default UserReviews;