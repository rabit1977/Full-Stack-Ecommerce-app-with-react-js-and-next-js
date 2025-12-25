
interface LoadingOverlayProps {
  isLoading: boolean;
}

export const LoadingOverlay = ({ isLoading }: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div className='absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg'>
      <div className='flex items-center gap-2 rounded-lg bg-card px-4 py-2 shadow-lg'>
        <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
        <span className='text-sm font-medium'>Loading products...</span>
      </div>
    </div>
  );
};