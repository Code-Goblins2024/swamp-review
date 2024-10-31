import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Input, Grid, Select, Option, CircularProgress } from '@mui/joy';
import { Search as SearchIcon } from '@mui/icons-material';
import supabase from '../config/supabaseClient';
import DormCard from '../components/DormCard';

const Search = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [housing, setHousing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHousing();
  }, [searchTerm, priceRange, sortBy]);

  const fetchHousing = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('housing')
        .select(`
          id,
          name
        `);

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (priceRange !== 'all') {
        query = query.lte('fallSpringPrice', priceRange);
      }

      if (sortBy === 'name') {
        query = query.order('name');
      } else if (sortBy === 'price') {
        query = query.order('fallSpringPrice');
      } else if (sortBy === 'rating') {
        query = query.order('averageRating', { foreignTable: 'averageRating' });
      }

      const { data, error } = await query;

      if (error) throw error;
      setHousing(data || []);
    } catch (error) {
      console.error('Error fetching housing:', error);
      setHousing([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDormClick = (dormId) => {
    navigate(`/housing/${dormId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography level="h2" sx={{ mb: 3 }}>Search Housing</Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid xs={12} md={12}>
          <Input
            startDecorator={<SearchIcon />}
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
            sx={{ width: '100%' }}
          />
        </Grid>
        {/* <Grid xs={6} md={3}>
          <Select
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue)}
            placeholder="Price Range"
            size="lg"
          >
            <Option value="all">All Prices</Option>
            <Option value="1000">Under $1,000</Option>
            <Option value="1500">Under $1,500</Option>
            <Option value="2000">Under $2,000</Option>
            <Option value="2500">Under $2,500</Option>
          </Select>
        </Grid>
        <Grid xs={6} md={3}>
          <Select
            value={sortBy}
            onChange={(_, newValue) => setSortBy(newValue)}
            placeholder="Sort By"
            size="lg"
          >
            <Option value="name">Name</Option>
            <Option value="price">Price</Option>
            <Option value="rating">Rating</Option>
          </Select>
        </Grid> */}
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {housing.length > 0 ? (
            housing.map((dorm) => (
              <Grid xs={12} sm={6} md={4} lg={3} key={dorm.id}>
                <DormCard
                  key={dorm?.id}
                  name={dorm?.name}
                  isFavorited={false}
                  housingId={dorm?.id}
                  onClick={() => handleDormClick(dorm?.id)}
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