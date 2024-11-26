import { Box, Typography, Card, CardContent, IconButton, Chip } from '@mui/joy';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon, StarRateRounded as RatingIcon, CommentRounded as ReviewIcon } from '@mui/icons-material';
import { addUserFavorite, removeUserFavorite } from '../functions/userQueries';
import useAuth from '../store/authStore';
import { useState } from 'react';
import { useTheme } from '@mui/joy';
import TagList from './TagList';

const DormCard = ({
  name,
  rating,
  reviews,
  onClick,
  isFavorited = false,
  housingId,
  onFavoriteRemoved,
  variant = 'grid',
  tags = [],
  onFavoriteChanged,
}) => {
  const { session } = useAuth();
  const [favorited, setFavorited] = useState(isFavorited);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const theme = useTheme();

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    try {
      if (favorited) {
        await removeUserFavorite(housingId, session.user.id);
        onFavoriteRemoved?.(housingId);
      } else {
        await addUserFavorite(housingId, session.user.id);
      }
      setFavorited(!favorited);
      if (onFavoriteChanged) {
        onFavoriteChanged(housingId, favorited);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleTagsClick = (e) => {
    e.stopPropagation();
    setShowAllTags(!showAllTags);
  };

  const cardStyles = variant === 'grid' ? {
    width: '100%',
    height: '100%',
  } : {
    width: 280,
    flexShrink: 0,
    mr: 2,
  };

  const displayedTags = showAllTags ? tags : tags.slice(0, 2);
  const hasMoreTags = tags.length > 2;

  return (
    <Card
      variant="outlined"
      onClick={onClick}
      sx={{
        ...cardStyles,
        cursor: 'pointer',
        transition: 'all 0.2s',
        padding: 0,
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ position: 'relative', height: '140px' }}>
        {!imageLoaded && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'neutral.softBg',
              animation: 'pulse 1.5s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 0.6 },
                '50%': { opacity: 0.8 },
                '100%': { opacity: 0.6 },
              },
            }}
          />
        )}
        <img
          src={imageError ? '/img-not-found.png' : `/housingImages/${name}.jpg`}
          style={{
            width: '100%',
            height: '140px',
            objectFit: 'cover',
            display: 'block',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          alt={`${name} Housing`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      </Box>
      <CardContent sx={{ px: 1.5, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            level="title-md"
            sx={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {name}
          </Typography>
          {session && (
            <IconButton
              onClick={handleFavoriteClick}
              sx={{ ml: 1 }}
            >
              {isFavorited ? (
                <FavoriteIcon sx={{ color: 'red.main' }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: 'red.main' }} />
              )}
            </IconButton>
          )}
        </Box>

        {tags.length > 0 && (
          <TagList
            tags={tags}
            maxVisibleTags={2}
          />
        )}

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mt: 1
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'neutral.softBg',
            borderRadius: 'sm',
            px: 1,
            py: 0.5
          }}>
            <RatingIcon sx={{ color: '#e6c200', mr: 0.5, fontSize: '1.1rem' }} />
            <Typography level="body-sm" sx={{ fontWeight: 600 }}>{rating.toFixed(1)}</Typography>
          </Box>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'neutral.softBg',
            borderRadius: 'sm',
            px: 1,
            py: 0.5
          }}>
            <ReviewIcon sx={{ color: 'neutral.500', mr: 0.5, fontSize: '1.1rem' }} />
            <Typography level="body-sm" sx={{ fontWeight: 600 }}>{reviews}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DormCard;