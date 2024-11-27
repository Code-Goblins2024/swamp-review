import { Box, Chip } from '@mui/joy';
import PropTypes from 'prop-types';
import { useState } from 'react';

const TagList = ({ tags, maxVisibleTags = 2 }) => {
  const [showAllTags, setShowAllTags] = useState(false);

  const handleTagsClick = (e) => {
    e.stopPropagation(); // Prevent parent click handlers
    setShowAllTags(!showAllTags);
  };


  const displayedTags = showAllTags ? tags : tags.slice(0, maxVisibleTags);
  const hasMoreTags = tags.length > maxVisibleTags;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.5,
        mt: 1,
        cursor: hasMoreTags ? 'pointer' : 'default',
      }}
      onClick={hasMoreTags ? handleTagsClick : undefined}
    >
      {displayedTags.map((tag) => (
        <Chip
          key={tag?.tag_name || tag.name}
          size="sm"
          variant="soft"
          color="primary"
          sx={{
            fontSize: '0.75rem',
            py: 0,
            height: '20px',
            borderRadius: '5px',
          }}
        >
          {tag?.tag_name || tag.name}
        </Chip>
      ))}
      {!showAllTags && hasMoreTags && (
        <Chip
          size="sm"
          variant="outlined"
          color="neutral"
          sx={{
            fontSize: '0.75rem',
            py: 0,
            height: '20px',
          }}
        >
          +{tags.length - maxVisibleTags} more
        </Chip>
      )}
    </Box>
  );
};

export default TagList;
