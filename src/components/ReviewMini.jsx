import React from 'react';
import { Box, Stack, Typography, Card } from '@mui/joy';
import { StarRateRounded as RatingIcon } from '@mui/icons-material';
import UserIcon from './UserIcon';
import TagList from './TagList';

const ReviewMini = ({ review }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1.5,
        p: 1.5,
        '&:last-child': {
          mb: 0
        }
      }}
    >
      <Stack spacing={1}>
        <Box>
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

            <Stack
              direction="row"
              spacing={2}
              sx={{ flexShrink: 0 }}
            >
              {review.ratings.map((rating, index) => (
                <Stack
                  key={index}
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
              ))}
            </Stack>
          </Stack>

          <Stack
            spacing={1}
            sx={{
              display: { xs: 'flex', sm: 'none' }
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
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

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 1
              }}
            >
              {review.ratings.map((rating, index) => (
                <Stack
                  key={index}
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
              ))}
            </Box>
          </Stack>
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

        {review.tags.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              overflow: 'auto',
              pb: 0.5,
              '::-webkit-scrollbar': {
                height: '4px'
              },
              '::-webkit-scrollbar-track': {
                background: 'transparent'
              },
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
        )}
      </Stack>
    </Card>
  );
};

export default ReviewMini;