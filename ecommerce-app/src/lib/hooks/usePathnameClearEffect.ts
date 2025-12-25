import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const usePathnameClearEffect = (resetSearch: () => void) => {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith('/products')) {
      resetSearch();
    }
  }, [pathname, resetSearch]);
};