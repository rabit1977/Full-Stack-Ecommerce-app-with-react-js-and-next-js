'use client';

import { useMobileSidebar } from '@/lib/hooks/useMobileSidebar';
import { Header } from './header';
import { MobileSidebar } from './mobile-sidebar';

interface MobileSidebarWrapperProps {
  initialWishlistCount: number;
  initialCartItemCount: number;
}

/**
 * Mobile Sidebar Wrapper Component - Optimized
 *
 * Uses custom hook for state management
 * React 19 patterns for optimal performance
 */
export function MobileSidebarWrapper({
  initialWishlistCount,
  initialCartItemCount,
}: MobileSidebarWrapperProps) {
  const sidebar = useMobileSidebar();

  return (
    <>
      <Header
        isMenuOpen={sidebar.isOpen}
        toggleMobileMenu={sidebar.toggle}
        initialWishlistCount={initialWishlistCount}
        initialCartItemCount={initialCartItemCount}
      />
      <MobileSidebar isOpen={sidebar.isOpen} onClose={sidebar.close} />
    </>
  );
}
