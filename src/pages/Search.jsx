import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Input, Grid, Select, Option, CircularProgress, Chip } from '@mui/joy';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import DormCard from '../components/DormCard';
import FilterSidebar from '../components/FilterSidebar';
import useAuth from '../store/authStore';
import { getAllHousing } from '../functions/housingQueries';
import { getUserFavorites } from "../functions/userQueries";
import { getAllTags } from '../functions/tagQueries';
import { calculateAverageRating } from '../functions/util';
import { ITEMS_PER_PAGE } from '../constants/Constants';

const Search = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [housing, setHousing] = useState([]);
  const [filteredHousing, setFilteredHousing] = useState([]);
  const [displayedHousing, setDisplayedHousing] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  const observer = useRef();
  const lastDormElementRef = useCallback(node => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    }, {
      threshold: 0.5,
      rootMargin: '100px'
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    fetchData();
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    filterAndSortHousing();
  }, [housing, searchTerm, sortBy, selectedTags]);

  useEffect(() => {
    setDisplayedHousing([]);
    setPage(1);
    setHasMore(true);
  }, [filteredHousing]);

  useEffect(() => {
    if (page === 1) {
      const initialItems = filteredHousing.slice(0, ITEMS_PER_PAGE);
      setDisplayedHousing(initialItems);
      setHasMore(initialItems.length === ITEMS_PER_PAGE);
    } else {
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newItems = filteredHousing.slice(startIndex, endIndex);

      if (newItems.length > 0) {
        setDisplayedHousing(prev => [...prev, ...newItems]);
        setHasMore(newItems.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    }
  }, [page, filteredHousing]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [housingData, favoritesData, tagsData] = await Promise.all([
        getAllHousing(),
        session ? getUserFavorites(session.user.id) : [],
        getAllTags()
      ]);

      setHousing(housingData || []);
      setFavorites(favoritesData || []);
      setAvailableTags(tagsData.map(tag => tag.name).sort());
    } catch (error) {
      console.error('Error fetching housing:', error);
      setHousing([]);
      setFavorites([]);
      setAvailableTags([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortHousing = () => {
    let filtered = [...housing];

    if (searchTerm) {
      filtered = filtered.filter(dorm =>
        dorm.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(dorm =>
        dorm.tags.some(dormTag => selectedTags.includes(dormTag.tag_name)));
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

    setFilteredHousing(filtered);
  };

  const isFavorited = (dormId) => {
    return favorites.some(fav => fav?.id === dormId);
  };

  const onFavoriteChanged = (housingId, isFavorited) => {
    if (isFavorited) {
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== housingId));
    } else {
      const selectedHousing = housing.find(h => h.id === housingId);
      if (selectedHousing) {
        setFavorites(prevFavorites => [...prevFavorites, selectedHousing]);
      }
    }
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setPage(1);
    setDisplayedHousing([]);
    setHasMore(true);
  };

  const handleDormClick = (dormId) => {
    navigate(`/housing/${dormId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    setDisplayedHousing([]);
    setHasMore(true);
  };

  const handleSortChange = (_, newValue) => {
    setSortBy(newValue);
    setPage(1);
    setDisplayedHousing([]);
    setHasMore(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        position: 'relative'
      }}
    >
      <FilterSidebar
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        isMobile={isMobile}
        onMobileOpen={() => setIsModalOpen(true)}
        onMobileClose={() => setIsModalOpen(false)}
        isModalOpen={isModalOpen}
      />

      <Box sx={{
        flexGrow: 1,
        overflowY: 'auto',
        p: 4
      }}>
        <Typography level="h2" sx={{ mb: 3 }}>Search Housing</Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid xs={12} md={8}>
            <Input
              startDecorator={<SearchIcon />}
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              size="lg"
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              placeholder="Sort By"
              size="lg"
            >
              <Option value="name">Name (A-Z)</Option>
              <Option value="rating">Highest Rated</Option>
              <Option value="reviews">Most Reviewed</Option>
            </Select>
          </Grid>
        </Grid>

        {selectedTags.length > 0 && (
          <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedTags.map(tag => (
              <Chip
                key={tag}
                variant="soft"
                endDecorator={<CloseIcon />}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Chip>
            ))}
          </Box>
        )}

        <Grid
          container
          spacing={2}
          sx={{
            px: { xs: 1, sm: 2, md: 4, lg: 6 },
            justifyContent: 'center',
            width: 'auto',
            mx: 'auto',
          }}
        >
          {displayedHousing.map((dorm, index) => (
            <Grid
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={dorm.id}
              ref={index === displayedHousing.length - 1 ? lastDormElementRef : null}
            >
              <DormCard
                name={dorm.name}
                isFavorited={isFavorited(dorm.id)}
                housingId={dorm.id}
                rating={calculateAverageRating(dorm.average_ratings)}
                reviews={dorm.reviews?.length || 0}
                onClick={() => handleDormClick(dorm.id)}
                variant='grid'
                tags={dorm.tags || []}
                onFavoriteChanged={onFavoriteChanged}
              />
            </Grid>
          ))}

          {loading && (
            <Grid xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            </Grid>
          )}

          {!loading && displayedHousing.length === 0 && (
            <Grid xs={12}>
              <Typography
                level="body-lg"
                sx={{
                  textAlign: 'center',
                  my: 4
                }}
              >
                No housing found matching your criteria.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Search;