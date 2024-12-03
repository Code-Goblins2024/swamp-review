/**
 * FilterSidebar component
 * 
 * This component displays a sidebar that allows the user to filter the dorms by tags.
 * It displays a list of tags that can be toggled on and off.
 * 
 * The component is responsive and will display a floating action button on mobile.
 */
import React from 'react';
import {
  Box, Typography, Sheet, Checkbox, List, ListItem, ListItemDecorator,
  Modal, ModalClose, IconButton
} from '@mui/joy';
import { FilterList as FilterIcon } from '@mui/icons-material';

const FilterSidebar = ({ availableTags, selectedTags, onTagToggle, isMobile, onMobileOpen, onMobileClose, isModalOpen }) => {
  const FilterContent = () => (
    <>
      <Typography level="title-lg" sx={{ mb: 2 }}>
        Filters
      </Typography>

      <Typography level="title-sm" sx={{ mb: 1.5, fontWeight: 'lg' }}>
        Tags
      </Typography>

      <List
        size="sm"
        sx={{
          '--ListItem-paddingY': '0.5rem',
          '--ListItem-paddingX': '1rem',
          '--ListItem-radius': '8px',
          gap: 0.5,
        }}
      >
        {availableTags.map((tag) => (
          <ListItem
            key={tag}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'background.level1'
              }
            }}
            onClick={() => onTagToggle(tag)}
          >
            <ListItemDecorator>
              <Checkbox
                checked={selectedTags.includes(tag)}
                onChange={(event) => {
                  event.stopPropagation();
                  onTagToggle(tag);
                }}
              />
            </ListItemDecorator>
            <Typography level="body-sm">
              {tag}
            </Typography>
          </ListItem>
        ))}
      </List>
    </>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={onMobileOpen}
          size="lg"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            borderRadius: '50%',
            bgcolor: 'primary.500',
            color: '#fff',
            boxShadow: 'md',
            zIndex: 1100,
            opacity: 0.9,
            '&:hover': {
              bgcolor: 'primary.600',
              opacity: 1
            }
          }}
        >
          <FilterIcon sx={{ fontSize: 24, color: '#fff' }} />
        </IconButton>

        <Modal
          aria-labelledby="filter-modal-title"
          open={isModalOpen}
          onClose={onMobileClose}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
          }}
        >
          <Sheet
            sx={{
              minHeight: '100dvh',
              width: '100%',
              maxWidth: '400px',
              p: 3,
              boxShadow: 'lg',
              bgcolor: 'background.surface',
            }}
          >
            <ModalClose sx={{ m: 1 }} />
            <Box sx={{ pt: 4 }}>
              <FilterContent />
            </Box>
          </Sheet>
        </Modal>
      </>
    );
  }

  return (
    <Sheet
      variant="outlined"
      sx={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        minWidth: '300px',
        p: 3,
        borderRadius: 0,
        borderTop: 0,
        borderBottom: 0,
        borderLeft: 0,
        overflowY: 'auto',
        display: { xs: 'none', md: 'block' }
      }}
    >
      <FilterContent />
    </Sheet>
  );
};

export default FilterSidebar;