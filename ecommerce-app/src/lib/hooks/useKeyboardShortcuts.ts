import { useEffect } from 'react';

export const useKeyboardShortcuts = (
  isOpen: boolean,
  onClose: () => void,
  onAddToCart?: () => void
) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === 'Escape') {
        onClose();
      }
      // Add to cart on Ctrl/Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && onAddToCart) {
        e.preventDefault();
        onAddToCart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onAddToCart]);
};