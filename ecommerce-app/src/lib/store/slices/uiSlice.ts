import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  searchQuery: string;
  isMenuOpen: boolean;
  quickViewProductId: string | null;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

/**
 * Get initial theme from localStorage or system preference
 */
const getInitialTheme = (): 'light' | 'dark' => {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return 'light';
  }

  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    // Fallback to system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (error) {
    console.error('Error loading theme:', error);
  }

  return 'light';
};

const initialState: UIState = {
  theme: getInitialTheme(),
  searchQuery: '',
  isMenuOpen: false,
  quickViewProductId: null,
  toast: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('theme', action.payload);
        } catch (error) {
          console.error('Error saving theme:', error);
        }
      }
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    setIsMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMenuOpen = action.payload;
    },
    
    setQuickViewProductId: (state, action: PayloadAction<string | null>) => {
      state.quickViewProductId = action.payload;
    },
    
    setToast: (
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'error' | 'info';
      } | null>
    ) => {
      state.toast = action.payload;
    },
    
    clearToast: (state) => {
      state.toast = null;
    },
    
    /**
     * Flexible way to update multiple UI state properties
     */
    setUiState: (state, action: PayloadAction<Partial<UIState>>) => {
      Object.assign(state, action.payload);
      
      // If theme was updated, persist it
      if (action.payload.theme && typeof window !== 'undefined') {
        try {
          localStorage.setItem('theme', action.payload.theme);
        } catch (error) {
          console.error('Error saving theme:', error);
        }
      }
    },
  },
});

export const {
  setTheme,
  setSearchQuery,
  setIsMenuOpen,
  setQuickViewProductId,
  setToast,
  clearToast,
  setUiState,
} = uiSlice.actions;

export default uiSlice.reducer;