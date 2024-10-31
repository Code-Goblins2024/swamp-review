import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Input, Grid, Select, Option, CircularProgress } from '@mui/joy';
import { Search as SearchIcon } from '@mui/icons-material';
import DormCard from '../components/DormCard';
import useAuth from '../store/authStore';
import { getAllHousing } from '../functions/housingQueries';
import { getUserFavorites } from "../functions/userQueries";
import { calculateAverageRating } from '../functions/util';

const Search = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [housing, setHousing] = useState([]);
  const [filteredHousing, setFilteredHousing] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortHousing();
  }, [housing, searchTerm, sortBy]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [housingData, favoritesData] = await Promise.all([
        getAllHousing(),
        session ? getUserFavorites(session.user.id) : []
      ]);
      setHousing(housingData || []);
      setFavorites(favoritesData || []);
    } catch (error) {
      console.error('Error fetching housing:', error);
      setHousing([]);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortHousing = () => {
    let filtered = [...housing];

    if (searchTerm) {
      filtered = filtered.filter(house =>
        house.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => {
        const aRating = calculateAverageRating(a.average_ratings);
        const bRating = calculateAverageRating(b.average_ratings);
        return bRating - aRating;
      });
    } else if (sortBy === 'reviews') {
      filtered.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
    }
    console.log(filtered);
    setFilteredHousing(filtered);
  };

  const isFavorited = (dormId) => {
    return favorites.some(fav => fav.housing?.id === dormId);
  };

  const handleDormClick = (dormId) => {
    navigate(`/housing/${dormId}`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography level="h2" sx={{ mb: 3 }}>Search Housing</Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid xs={12} md={8}>
          <Input
            startDecorator={<SearchIcon />}
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid xs={6} md={4}>
          <Select
            value={sortBy}
            onChange={(_, newValue) => setSortBy(newValue)}
            placeholder="Sort By"
            size="lg"
          >
            <Option value="name">Name (A-Z)</Option>
            <Option value="rating">Highest Rated</Option>
            <Option value="reviews">Most Reviewed</Option>
          </Select>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} sx={{
          px: { xs: 2, sm: 4, md: 8, lg: 12 },
          justifyContent: 'center',
          width: 'auto',
          mx: 'auto',
        }}>
          {filteredHousing.length > 0 ? (
            filteredHousing.map((dorm) => (
              <Grid xs={12} sm={6} md={4} lg={3} key={dorm.id}>
                <DormCard
                  key={dorm.id}
                  name={dorm?.name}
                  isFavorited={isFavorited(dorm.id)}
                  housingId={dorm.id}
                  rating={calculateAverageRating(dorm.average_ratings)}
                  reviews={dorm.reviews?.length || 0}
                  onClick={() => handleDormClick(dorm.id)}
                />
              </Grid>
            ))
          ) : (
            <Grid xs={12}>
              <Typography level="body-lg" sx={{ textAlign: 'center', my: 4 }}>
                No housing found matching your criteria.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default Search;