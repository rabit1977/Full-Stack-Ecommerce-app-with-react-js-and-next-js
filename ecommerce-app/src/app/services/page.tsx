// app/services/page.tsx
import { ServicesContent } from './ServicesContent';
import { ServicesSkeleton } from './ServicesSkeleton';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Discover the range of services Electro offers, including fast shipping, 24/7 support, quality assurance, and easy returns.',
};

const ServicesPage = () => {
  return (
    <Suspense fallback={<ServicesSkeleton />}>
      <ServicesContent />
    </Suspense>
  );
};

export default ServicesPage;
