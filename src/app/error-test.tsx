'use client';

import * as Sentry from '@sentry/nextjs';
import { useState } from 'react';

export default function ErrorTest() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTestError = () => {
    try {
      // Intentionally throwing an error for testing
      throw new Error('This is a test error for GlitchTip');
    } catch (error) {
      if (error instanceof Error) {
        // Capture the error with Sentry/GlitchTip
        Sentry.captureException(error);
        setErrorMessage('Error sent to GlitchTip!');
      }
    }
  };

  const handleTestMessage = () => {
    // Send a message to GlitchTip
    Sentry.captureMessage('Test message from the application');
    setErrorMessage('Message sent to GlitchTip!');
  };

  return (
    <div className="p-4 mt-8 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">GlitchTip Testing</h2>
      <div className="flex flex-col gap-4">
        <button 
          onClick={handleTestError}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Trigger Test Error
        </button>
        <button 
          onClick={handleTestMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Send Test Message
        </button>
        {errorMessage && (
          <div className="mt-4 p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
} 