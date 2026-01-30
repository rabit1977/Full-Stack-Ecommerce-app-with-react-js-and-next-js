import { AboutSkeleton } from './AboutSkeleton';

export default function AboutLoading() {
  return (
    <div className='bg-background min-h-screen'>
      <div className='container mx-auto px-4 py-12 sm:py-16 lg:py-20 max-w-6xl'>
        <AboutSkeleton />
      </div>
    </div>
  );
}
