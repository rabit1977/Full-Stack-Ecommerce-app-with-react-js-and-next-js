import { useState, useCallback } from 'react';
import { Product } from '@/lib/types';

export const useSearchState = () => {
  const [inputValue, setInputValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const clearSearch = useCallback(() => {
    setInputValue('');
    setSearchResults([]);
  }, []);

  const resetSearch = useCallback(() => {
    setInputValue('');
    setSearchResults([]);
    setIsSearchFocused(false);
  }, []);

  return {
    inputValue,
    setInputValue,
    isSearchFocused,
    setIsSearchFocused,
    searchResults,
    setSearchResults,
    isLoading,
    setIsLoading,
    clearSearch,
    resetSearch,
  };
};