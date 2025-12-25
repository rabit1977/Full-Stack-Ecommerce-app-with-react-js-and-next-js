import { useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface UseSearchNavigationProps {
  inputValue: string;
  setIsSearchFocused: (focused: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const useSearchNavigation = ({
  inputValue,
  setIsSearchFocused,
  inputRef,
}: UseSearchNavigationProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigateToSearchResults = useCallback(() => {
    if (inputValue.trim()) {
      startTransition(() => {
        router.push(
          `/products?search=${encodeURIComponent(inputValue.trim())}`
        );
        setIsSearchFocused(false);
        inputRef.current?.blur();
      });
    }
  }, [inputValue, router, setIsSearchFocused, inputRef]);

  return { navigateToSearchResults, isPending };
};