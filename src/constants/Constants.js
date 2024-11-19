// The percentage of reviews that must have a certain tag for the housing to be marked with said tag
// e.g. if the threshold is 0.5, at least 5 out of 10 reviews must have the "Social" tag for Broward to be marked "Social"
export const TAG_THRESHOLD = 0.5;

// The number of items to display per page in the search results
export const ITEMS_PER_PAGE = 12;

export const theme = {
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: '#121314',
          surface: '#18191A',
          level1: '#1F2021',
          level2: '#242526', 
          level3: '#3A3B3C', 
          level4: '#4A4B4C', 
          level5: '#5A5B5C', 
          level6: '#6A6B6C', 
          level7: '#7A7B7C', 
          level8: '#8A8B8C', 
          level9: '#9A9B9C', 
          level10: '#AAAAAC',
        },
        neutral: {
          softBg: 'var(--joy-palette-background-level1)', 
          softHoverBg: 'var(--joy-palette-background-level5)',
          softActiveBg: 'var(--joy-palette-background-level6)',
          softFocusBg: 'var(--joy-palette-background-level7)',
          softFocusBorder: '#CCCCCC',
          softColor: '#A3A4A5', 
        },
        red: {
          main: "#e57373"
        }
      },
    },
    light: {
      palette: {
        red: {
          main: "#f44336"
        }
      }
    }
  },
};