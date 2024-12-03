/**
 * Minified component for displaying user reviews - takes in review object and follows standard table structure from Supabase to display
 * Accepts "ownedByCurrentUser" prop for custom styling when the current user wrote the review
 */
import React, { useState } from 'react';
import { Box, Stack, Typography, Card, Button, CircularProgress } from '@mui/joy';
import { StarRateRounded as RatingIcon, Delete as DeleteIcon } from '@mui/icons-material';
import UserIcon from './UserIcon';
import TagList from './TagList';
import useAuth from '../store/authStore';
import { deleteReview } from "../functions/reviewQueries";

const ReviewHeader = ({ review }) => (
  <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
    <UserIcon user={review.user} hoverable={false} />
    <Box sx={{ minWidth: 0 }}>
      <Typography
        level="title-sm"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {review.housing.name}
      </Typography>
      <Typography level="body-xs" sx={{ color: 'neutral.500' }}>
        {new Date(review.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).replaceAll(",", "")}
      </Typography>
    </Box>
  </Stack>
);

const RatingDisplay = ({ rating }) => (
  <Stack
    spacing={0.5}
    sx={{ alignItems: 'center' }}
  >
    <Typography
      level="body-xs"
      sx={{
        color: 'neutral.500',
        textAlign: 'center'
      }}
    >
      {rating.category.name}
    </Typography>
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      <RatingIcon sx={{ color: '#e6c200', fontSize: '1.1rem' }} />
      <Typography level="body-sm" fontWeight="md">
        {rating.value.toFixed(1)}
      </Typography>
    </Stack>
  </Stack>
);

const DesktopView = ({ review }) => (
  <Stack
    direction="row"
    spacing={1}
    sx={{
      alignItems: "flex-start",
      justifyContent: "space-between",
      display: { xs: 'none', sm: 'flex' }
    }}
  >
    <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0, flex: 1 }}>
      <ReviewHeader review={review} />
    </Stack>

    <Stack
      direction="row"
      spacing={2}
      sx={{ flexShrink: 0 }}
    >
      {review.ratings.map((rating, index) => (
        <RatingDisplay key={index} rating={rating} />
      ))}
    </Stack>
  </Stack>
);

const MobileView = ({ review }) => (
  <Stack
    spacing={1}
    sx={{
      display: { xs: 'flex', sm: 'none' }
    }}
  >
    <ReviewHeader review={review} />
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 1
      }}
    >
      {review.ratings.map((rating, index) => (
        <RatingDisplay key={index} rating={rating} />
      ))}
    </Box>
  </Stack>
);

const ReviewMini = ({ review, ownedByCurrentUser }) => {
  const { session } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteReview = async (reviewId) => {
    try {
      setDeleteLoading(true);
      await deleteReview(reviewId);
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1.5,
        p: 1.5,
        '&:last-child': { mb: 0 }
      }}
    >
      <Stack spacing={1}>
        <Box>
          <DesktopView review={review} />
          <MobileView review={review} />
        </Box>

        {review.content && (
          <Typography
            level="body-sm"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.4em',
              maxHeight: '2.8em'
            }}
          >
            {review.content}
          </Typography>
        )}

        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          {review.tags.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                overflow: 'auto',
                pb: 0.5,
                flex: 1,
                '::-webkit-scrollbar': { height: '4px' },
                '::-webkit-scrollbar-track': { background: 'transparent' },
                '::-webkit-scrollbar-thumb': {
                  background: 'neutral.300',
                  borderRadius: '4px'
                }
              }}
            >
              <TagList
                tags={review.tags}
                maxVisibleTags={5}
                sx={{
                  display: 'flex',
                  flexWrap: 'nowrap',
                  gap: 0.5
                }}
              />
            </Box>
          ) : <Box sx={{ flex: 1 }} />}

          {ownedByCurrentUser && session?.user?.id && (
            <Button
              color="neutral"
              variant="soft"
              size="sm"
              sx={{ position: "relative", ml: 1 }}
              onClick={() => handleDeleteReview(review.id)}
            >
              {deleteLoading && (
                <CircularProgress
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
              <Box
                sx={{
                  display: "flex",
                  opacity: deleteLoading ? 0 : 1,
                }}
              >
                <DeleteIcon sx={{ fontSize: "24px" }} />
              </Box>
            </Button>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

export default ReviewMini;