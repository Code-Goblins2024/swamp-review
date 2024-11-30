import { Box, Typography, Chip } from '@mui/joy';
import { 
  StarRateRounded as RatingIcon, 
  CommentRounded as ReviewIcon, 
  Apartment as ApartmentIcon 
} from '@mui/icons-material';
import TagList from './TagList';
import useAuth from '../store/authStore';
import { useState } from 'react';

const DormCardMini = ({
  name,
  rating,
  reviews,
  onClick,
  tags = [],
  housingId,
}) => {

  return (
    <Box
      key={housingId}
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        p: 1,
        borderRadius: 1,
        cursor: 'pointer',
        transition: 'all 0.3s',
        bgcolor: 'background.paper',
        '&:hover': {
          bgcolor: '#DDDDDD',
        },
      }}
      onClick={onClick}
    >
      {/* Icon Section */}
      <Box sx={{ mr: 2 }}>
        <ApartmentIcon sx={{ color: 'primary.main' }} />
      </Box>

      {/* Content Section */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          level="title-sm"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 0.5,
            fontSize: '0.875rem',
            color: 'text.secondary',
          }}
        >
          {/* Rating */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: 'neutral.softBg',
              px: 0.75,
              py: 0.25,
              borderRadius: 'sm',
            }}
          >
            <RatingIcon sx={{ color: '#e6c200', fontSize: '1rem' }} />
            <Typography level="body-sm" sx={{ fontWeight: 600 }}>
              {reviews && reviews > 0 ? rating.toFixed(1) : '---'}
            </Typography>
          </Box>
          {/* Reviews */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: 'neutral.softBg',
              px: 0.75,
              py: 0.25,
              borderRadius: 'sm',
            }}
          >
            <ReviewIcon sx={{ color: 'neutral.500', fontSize: '1rem' }} />
            <Typography level="body-sm" sx={{ fontWeight: 600 }}>
              {reviews}
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* Tags */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
      {tags.length > 0 && (
        <TagList tags={tags} maxVisibleTags={2} />
          )}
      </Box>
    </Box>
  );
};

export default DormCardMini;
