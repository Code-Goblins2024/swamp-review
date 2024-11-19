// The percentage of reviews that must have a certain tag for the housing to be marked with said tag
// e.g. if the threshold is 0.5, at least 5 out of 10 reviews must have the "Social" tag for Broward to be marked "Social"
export const TAG_THRESHOLD = 0.5;

// The number of items to display per page in the search results
export const ITEMS_PER_PAGE = 12;

export const darkModeScheme = {
  palette: {
    background: {
      body: '#121314',    // Main background
      surface: '#18191A', // Slightly lighter for general containers
      // surface: "#ff0000",
      level1: '#1F2021',  // Level 1 background
      level2: '#242526',  // Level 2 background
      level3: '#3A3B3C',  // Level 3 background
      level4: '#4A4B4C',  // Level 4 background
      level5: '#5A5B5C',  // Level 5 background
      level6: '#6A6B6C',  // Level 6 background
      level7: '#7A7B7C',  // Level 7 background
      level8: '#8A8B8C',  // Level 8 background
      level9: '#9A9B9C',  // Level 9 background
      level10: '#AAAAAC', // Level 10 background
    },
    neutral: {
      // Soft background variables
      softBg: 'var(--joy-palette-background-level1)',  // Base soft background (Level 4)
      softHoverBg: 'var(--joy-palette-background-level5)', // Soft hover background (Level 5)
      softActiveBg: 'var(--joy-palette-background-level6)', // Soft active background (Level 6)
      softFocusBg: 'var(--joy-palette-background-level7)', // Soft focus background (Level 7)
      softFocusBorder: '#CCCCCC', // Soft border color for focused elements
      softColor: '#A3A4A5',  // Soft text color (light neutral gray)
    },
  },
};