import { Box, Typography, Card, CardContent } from '@mui/joy';
import { Favorite as FavoriteIcon, Apartment as ApartmentIcon, StarRateRounded as RatingIcon } from '@mui/icons-material';

const DormCard = ({ name, rating, image, onClick }) => (
  <Card variant="outlined" onClick={onClick} sx={{
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

export default DormCard;