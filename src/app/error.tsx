'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to GlitchTip
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Something went wrong!
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              An unexpected error occurred. Our team has been notified.
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded mb-6 overflow-auto">
              <code className="text-sm text-gray-800 dark:text-gray-200">
                {error.message || "Unknown error"}
              </code>
            </div>
            <button
              onClick={() => reset()}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 