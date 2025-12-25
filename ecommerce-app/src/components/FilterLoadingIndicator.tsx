interface FilterLoadingIndicatorProps {
  isPending: boolean;
}

export const FilterLoadingIndicator = ({ isPending }: FilterLoadingIndicatorProps) => {
  if (!isPending) return null;

  return (
    <div className='mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground'>
      <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
      <span>Applying filters...</span>
    </div>
  );
};