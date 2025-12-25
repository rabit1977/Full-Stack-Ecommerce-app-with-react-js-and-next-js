'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/lib/store/hooks';

/**
 * Theme manager component that syncs theme with DOM
 * 
 * Features:
 * - Applies theme class to document root
 * - Theme persistence handled in Redux slice
 * - Syncs with system preference on initial load
 */
const ThemeManager = () => {
  const theme = useAppSelector((state) => state.ui.theme);

  // Apply theme to DOM
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return null;
};

export { ThemeManager };