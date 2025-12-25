import { useCallback } from 'react';

interface UseSearchKeyboardProps {
  navigateToSearchResults: () => void;
  setIsSearchFocused: (focused: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useSearchKeyboard = ({
  navigateToSearchResults,
  setIsSearchFocused,
  inputRef,
  containerRef,
}: UseSearchKeyboardProps) => {
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        navigateToSearchResults();
      } else if (e.key === 'Escape') {
        setIsSearchFocused(false);
        inputRef.current?.blur();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const firstResult = containerRef.current?.querySelector('a');
        if (firstResult instanceof HTMLElement) {
          firstResult.focus();
        }
      }
    },
    [navigateToSearchResults, setIsSearchFocused, inputRef, containerRef]
  );

  const handleResultKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextLink = containerRef.current?.querySelectorAll('a')[index + 1];
        if (nextLink instanceof HTMLElement) {
          nextLink.focus();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (index === 0) {
          inputRef.current?.focus();
        } else {
          const prevLink = containerRef.current?.querySelectorAll('a')[index - 1];
          if (prevLink instanceof HTMLElement) {
            prevLink.focus();
          }
        }
      } else if (e.key === 'Escape') {
        setIsSearchFocused(false);
        inputRef.current?.focus();
      }
    },
    [setIsSearchFocused, inputRef, containerRef]
  );

  return { handleSearchKeyDown, handleResultKeyDown };
};