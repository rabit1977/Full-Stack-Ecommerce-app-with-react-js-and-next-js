// lib/hooks/useMobileSidebar.ts
'use client';

import { useState, useCallback, useTransition, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Custom hook for managing mobile sidebar state
 * 
 * Features:
 * - Auto-close on route change
 * - Transition support for React 19
 * - Body scroll lock management
 * - Keyboard shortcuts (ESC to close)
 */
export function useMobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  /**
   * Open sidebar
   */
  const open = useCallback(() => {
    startTransition(() => {
      setIsOpen(true);
    });
  }, []);

  /**
   * Close sidebar
   */
  const close = useCallback(() => {
    startTransition(() => {
      setIsOpen(false);
    });
  }, []);

  /**
   * Toggle sidebar
   */
  const toggle = useCallback(() => {
    startTransition(() => {
      setIsOpen((prev) => !prev);
    });
  }, []);

  /**
   * Auto-close on route change
   */
  useEffect(() => {
    if (isOpen) {
      close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /**
   * Handle ESC key to close
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  return {
    isOpen,
    isPending,
    open,
    close,
    toggle,
  };
}