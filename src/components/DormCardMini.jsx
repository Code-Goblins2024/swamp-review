/**
 * DormCardMini component
 * 
 * A compact card component that displays information about a dorm.
 * Allows the user to click on the card to navigate to the dorm's page.
 */
import { Box, Typography } from '@mui/joy';
import { 
  StarRateRounded as RatingIcon, 
  CommentRounded as ReviewIcon, 
} from '@mui/icons-material';
import TagList from './TagList';

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
        mb: 0.5,
        p: 1.5,
        borderRadius: "0.3rem",
        cursor: 'pointer',
        transition: 'all 0.3s',
        bgcolor: 'background.paper',
        '&:hover': {
          bgcolor: '#efefef',
        },
      }}
      onClick={onClick}
    >

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
      <Box sx={{ flex: 1, minWidth: 0 }}>
      {tags.length > 0 && (
        <TagList tags={tags} maxVisibleTags={2} />
          )}
      </Box>
    </Box>
  );
};

export default DormCardMini;
