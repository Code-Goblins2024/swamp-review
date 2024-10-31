import { Box, Typography, Card, CardContent, IconButton } from '@mui/joy';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon, StarRateRounded as RatingIcon, CommentRounded as ReviewIcon } from '@mui/icons-material';
import { addUserFavorite, removeUserFavorite } from '../functions/userQueries';
import useAuth from '../store/authStore';
import { useState, useEffect } from 'react';

const DormCard = ({ name, rating, reviews, onClick, isFavorited = false, housingId, onFavoriteRemoved }) => {
  const { session } = useAuth();
  const [favorited, setFavorited] = useState(isFavorited);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
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
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Card variant="outlined" onClick={onClick} sx={{
      width: 200,
      mr: 2,
      cursor: 'pointer',
      transition: 'all 0.3s',
      padding: 0,
      overflow: 'hidden',
      '&:hover': {
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
      },
    }}>
      <img
        src={imageError ? '/img-not-found.png' : `/housingImages/${name}.jpg`}
        style={{ width: '100%', height: "120px", objectFit: 'cover', display: 'block' }}
        alt={`${name} Housing`}
        onError={handleImageError}
      />
      <CardContent sx={{ px: 1.5, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'top', mt: 0 }}>
          <IconButton
            onClick={handleFavoriteClick}
          >
            {favorited ? (
              <FavoriteIcon sx={{ color: 'error.main' }} />
            ) : (
              <FavoriteBorderIcon sx={{ color: 'error.main' }} />
            )}
          </IconButton>
          <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} level="title-md">{name}</Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 1.5
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