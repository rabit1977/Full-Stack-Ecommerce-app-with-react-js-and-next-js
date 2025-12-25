import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { showToast } from '@/lib/store/thunks/uiThunks';
import {
  setTheme,
  setSearchQuery,
  setIsMenuOpen,
  setQuickViewProductId,
} from '@/lib/store/slices/uiSlice';
import { useCallback } from 'react';

export const useUI = () => {
  const dispatch = useAppDispatch();
  const { theme, searchQuery, isMenuOpen, quickViewProductId, toast } = useAppSelector((state) => state.ui);

  const handleSetTheme = useCallback(
    (newTheme: 'light' | 'dark') => {
      dispatch(setTheme(newTheme));
    },
    [dispatch]
  );

  const handleSetSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const handleSetIsMenuOpen = useCallback(
    (isOpen: boolean) => {
      dispatch(setIsMenuOpen(isOpen));
    },
    [dispatch]
  );

  const handleSetQuickViewProductId = useCallback(
    (id: string | null) => {
      dispatch(setQuickViewProductId(id));
    },
    [dispatch]
  );

  const handleShowToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      dispatch(showToast(message, type));
    },
    [dispatch]
  );

  return {
    theme,
    searchQuery,
    isMenuOpen,
    quickViewProductId,
    toast,
    setTheme: handleSetTheme,
    setSearchQuery: handleSetSearchQuery,
    setIsMenuOpen: handleSetIsMenuOpen,
    setQuickViewProductId: handleSetQuickViewProductId,
    showToast: handleShowToast,
  };
};
