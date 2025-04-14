'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Error caught by Next.js error boundary:', error);
    
    // Report the error to Sentry manually
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="mb-4 max-w-md text-gray-600">
        An unexpected error occurred. Our team has been notified.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-4 bg-red-50 rounded-md text-left max-w-lg">
          <p className="text-sm font-mono text-red-800 whitespace-pre-wrap">{error.message}</p>
        </div>
      )}
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Try again
      </button>
    </div>
  );
} 