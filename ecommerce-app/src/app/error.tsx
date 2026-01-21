'use client';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  let message = 'Something went wrong';

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (
    typeof error === 'object' &&
    error !== null &&
    'error' in error
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message = String((error as any).error);
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold">Error</h2>
      <p className="text-sm text-red-600 mt-2">{message}</p>
      <button
        onClick={reset}
        className="mt-4 underline text-sm"
      >
        Try again
      </button>
    </div>
  );
}
