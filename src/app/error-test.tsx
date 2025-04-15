'use client';

import * as Sentry from '@sentry/nextjs';
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    testSentryError?: () => void;
  }
}

export default function ErrorTest() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [hasGlobalTestFn, setHasGlobalTestFn] = useState(false);

  // Check for global test function when component mounts
  useEffect(() => {
    setHasGlobalTestFn(typeof window !== 'undefined' && typeof window.testSentryError === 'function');
  }, []);

  const handleTestError = () => {
    try {
      setErrorMessage('Sending error to GlitchTip...');
      setDebugInfo(null);
      
      // Create an error with a unique identifier to easily find in GlitchTip
      const uniqueId = new Date().getTime().toString();
      const testError = new Error(`Test error with ID: ${uniqueId}`);
      
      // Capture and log the error status
      const eventId = Sentry.captureException(testError);
      
      console.log('Error sent to Sentry/GlitchTip:', {
        eventId,
        error: testError.message
      });
      
      setErrorMessage(`Error sent to GlitchTip! Event ID: ${eventId}`);
      setDebugInfo(`Error message: "${testError.message}"`);
    } catch (error) {
      console.error('Failed to send error:', error);
      setErrorMessage('Failed to send error to GlitchTip');
      setDebugInfo(error instanceof Error ? error.message : String(error));
    }
  };

  const handleTestMessage = () => {
    try {
      setErrorMessage('Sending message to GlitchTip...');
      setDebugInfo(null);
      
      // Include timestamp for unique identification
      const uniqueId = new Date().getTime().toString();
      const message = `Test message ${uniqueId}`;
      
      // Capture and log the message status
      const eventId = Sentry.captureMessage(message, {
        level: 'info',
        tags: {
          test_type: 'manual_test',
          timestamp: uniqueId
        },
      });
      
      console.log('Message sent to Sentry/GlitchTip:', {
        eventId,
        message
      });
      
      setErrorMessage(`Message sent to GlitchTip! Event ID: ${eventId}`);
      setDebugInfo(`Message content: "${message}"`);
    } catch (error) {
      console.error('Failed to send message:', error);
      setErrorMessage('Failed to send message to GlitchTip');
      setDebugInfo(error instanceof Error ? error.message : String(error));
    }
  };

  // Function to check Sentry/GlitchTip status
  const checkSentryStatus = () => {
    setErrorMessage('Checking Sentry/GlitchTip status...');
    
    try {
      // Use a simpler approach that doesn't rely on getCurrentHub
      // Send a test event to verify Sentry connection
      const testEventId = Sentry.captureMessage('Sentry connection test', {
        level: 'debug',
      });
      
      setDebugInfo(`
DSN: Using GlitchTip at gt.bm.onlydaniel.me
Test Event ID: ${testEventId || 'Not generated'}
Environment: ${process.env.NODE_ENV}
SDK Initialized: ${testEventId ? 'Yes' : 'No'}
Browser: ${navigator.userAgent}
      `);
      
      setErrorMessage('Sentry/GlitchTip status checked');
    } catch (error) {
      setErrorMessage('Failed to check Sentry/GlitchTip status');
      setDebugInfo(error instanceof Error ? error.message : String(error));
    }
  };

  // Function to trigger a real JavaScript error
  const triggerRealError = () => {
    setErrorMessage('Triggering a real JavaScript error...');
    setDebugInfo(null);
    
    try {
      // This will cause a real JavaScript error
      setTimeout(() => {
        // Using non-null assertion to fix TypeScript error while still causing a runtime error
        const obj = null;
        // @ts-expect-error - Intentionally causing an error
        obj!.nonExistentMethod(); // This will throw a TypeError
      }, 100);
      
      setErrorMessage('Real error triggered. Check GlitchTip in a moment.');
    } catch (error) {
      // Note: The error above happens in the setTimeout so this catch won't fire
      // The error should be caught by the global Sentry handler
      console.error('Caught error manually:', error);
    }
  };

  // Function to trigger the global test error
  const triggerGlobalError = () => {
    if (typeof window !== 'undefined' && window.testSentryError) {
      setErrorMessage('Triggering global error from window method...');
      setDebugInfo(null);
      
      try {
        window.testSentryError();
      } catch (error) {
        console.error('Global error test caught:', error);
      }
    } else {
      setErrorMessage('Global test function not available');
      setDebugInfo('The window.testSentryError function was not found. Make sure the layout script has loaded properly.');
    }
  };

  // Add a new test function with a unique, searchable error message
  const sendUniqueSearchableError = () => {
    setErrorMessage('Sending unique searchable error...');
    setDebugInfo(null);
    
    const uniqueId = Date.now().toString();
    const searchableMessage = `UNIQUE_TEST_ERROR_${uniqueId}`;
    
    try {
      // Use several different Sentry methods to increase chances of success
      
      // Method 1: captureMessage with error level
      Sentry.captureMessage(searchableMessage, {
        level: 'error',
        tags: {
          test_id: uniqueId,
          method: 'captureMessage'
        }
      });
      
      // Method 2: captureException with Error object
      Sentry.captureException(new Error(searchableMessage), {
        tags: {
          test_id: uniqueId,
          method: 'captureException'
        }
      });
      
      // Method 3: capture with withScope
      Sentry.withScope(scope => {
        scope.setLevel('fatal');
        scope.setTag('test_id', uniqueId);
        scope.setTag('method', 'withScope');
        Sentry.captureMessage(searchableMessage);
      });
      
      setErrorMessage(`Unique error sent! Search for: ${searchableMessage}`);
      setDebugInfo(`This error should be searchable in GlitchTip.\nThe unique ID is: ${uniqueId}`);
    } catch (error) {
      console.error('Error sending unique error:', error);
      setErrorMessage('Failed to send unique error');
      setDebugInfo(error instanceof Error ? error.message : String(error));
    }
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
        <button 
          onClick={checkSentryStatus}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Check Sentry Status
        </button>
        <button 
          onClick={triggerRealError}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          Trigger Real Error
        </button>
        {hasGlobalTestFn && (
          <button 
            onClick={triggerGlobalError}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          >
            Test Global Error
          </button>
        )}
        <button 
          onClick={sendUniqueSearchableError}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
        >
          Send Searchable Error
        </button>
        {errorMessage && (
          <div className="mt-4 p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded">
            {errorMessage}
          </div>
        )}
        {debugInfo && (
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded font-mono text-xs whitespace-pre-wrap">
            {debugInfo}
          </div>
        )}
      </div>
    </div>
  );
} 