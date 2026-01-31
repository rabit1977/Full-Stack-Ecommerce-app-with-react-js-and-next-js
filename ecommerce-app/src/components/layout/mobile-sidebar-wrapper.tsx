'use client';

import { useMobileSidebar } from '@/lib/hooks/useMobileSidebar';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from './header';
import { MobileSidebar } from './mobile-sidebar';

interface MobileSidebarWrapperProps {
  initialWishlistCount: number;
  initialCartItemCount: number;
}

/**
 * Mobile Sidebar Wrapper Component
 * Includes header, mobile sidebar, and mobile bottom navigation
 */
export function MobileSidebarWrapper({
  initialWishlistCount,
  initialCartItemCount,
}: MobileSidebarWrapperProps) {
  const sidebar = useMobileSidebar();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdminRoute = pathname?.startsWith('/admin');

  // Avoid hydration mismatch by not rendering anything that depends on client state/pathname
  // until the component has mounted on the client.
  if (!mounted || isAdminRoute) {
    return null;
  }

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
