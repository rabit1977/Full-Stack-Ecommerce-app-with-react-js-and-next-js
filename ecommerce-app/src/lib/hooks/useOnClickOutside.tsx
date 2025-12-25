'use client';

import { useEffect, RefObject } from 'react';

type Event = MouseEvent | TouchEvent;

// The only change is in this type definition
export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  // Allow the RefObject to contain a null value
  ref: RefObject<T | null>, 
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      
      // This logic already safely handles the case where el is null
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};