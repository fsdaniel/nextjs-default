'use client';

import { useState } from 'react';

export default function DirectTest() {
  const [status, setStatus] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const sendDirectRequest = async () => {
    setStatus('Sending direct request to GlitchTip...');
    setResponse(null);

    try {
      // Create a basic event payload
      const event = {
        event_id: crypto.randomUUID().replace(/-/g, ''),
        timestamp: new Date().toISOString(),
        platform: 'javascript',
        level: 'error',
        message: 'Direct test message to GlitchTip API',
        tags: {
          source: 'direct_test',
          timestamp: Date.now().toString()
        }
      };

      // Project ID is usually the last part of the DSN URL
      const dsn = 'https://037a152fa3d04dd486d0e93d6c6e502e@gt.bm.onlydaniel.me/1';
      const url = 'https://gt.bm.onlydaniel.me/api/1/store/';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=037a152fa3d04dd486d0e93d6c6e502e, sentry_client=manual-test/1.0`
        },
        body: JSON.stringify(event)
      });

      const responseText = await response.text();
      
      setStatus(`Response status: ${response.status} ${response.statusText}`);
      setResponse(responseText || 'No response body');
      
    } catch (error) {
      console.error('Direct request failed:', error);
      setStatus('Failed to send direct request');
      setResponse(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className="p-4 mt-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Direct GlitchTip API Test</h2>
      <button
        onClick={sendDirectRequest}
        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
      >
        Send Direct API Request
      </button>
      
      {status && (
        <div className="mt-4 p-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded">
          {status}
        </div>
      )}
      
      {response && (
        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded font-mono text-xs whitespace-pre-wrap overflow-auto max-h-40">
          {response}
        </div>
      )}
    </div>
  );
} 