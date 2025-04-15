'use client';

import { useState } from 'react';

// Define the event type
interface SentryEvent {
  event_id: string;
  timestamp: string;
  platform: string;
  level: string;
  message: string;
  logger?: string;
  transaction?: string;
  server_name?: string;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

// Define response type
interface EndpointResponse {
  success: boolean;
  status?: number;
  text?: string;
  error?: unknown;
}

export default function DirectTest() {
  const [status, setStatus] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const sendDirectRequest = async () => {
    setStatus('Sending direct request to GlitchTip...');
    setResponse(null);

    try {
      // Create a more complete event payload
      const event: SentryEvent = {
        event_id: crypto.randomUUID().replace(/-/g, ''),
        timestamp: new Date().toISOString(),
        platform: 'javascript',
        level: 'error',
        message: 'Direct test message to GlitchTip API',
        logger: 'javascript',
        transaction: 'direct-api-test',
        server_name: window.location.hostname,
        tags: {
          source: 'direct_test',
          timestamp: Date.now().toString()
        },
        extra: {
          test: true
        }
      };

      // Try both API endpoints
      await testStoreEndpoint(event);
      await testEnvelopeEndpoint(event);
      
    } catch (error) {
      console.error('Direct request failed:', error);
      setStatus('Failed to send direct request');
      setResponse(error instanceof Error ? error.message : String(error));
    }
  };

  // Test the original /store/ endpoint
  const testStoreEndpoint = async (event: SentryEvent): Promise<EndpointResponse> => {
    try {
      // Using DSN key directly in auth header
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
      
      setStatus(`Store endpoint response: ${response.status} ${response.statusText}`);
      setResponse(`Store endpoint: ${responseText || 'No response body'}`);
      
      return { success: response.ok, status: response.status, text: responseText };
    } catch (error) {
      console.error('Store endpoint error:', error);
      return { success: false, error };
    }
  };

  // Test the new /envelope/ endpoint
  const testEnvelopeEndpoint = async (event: SentryEvent): Promise<EndpointResponse> => {
    try {
      // Create a Sentry envelope format
      const envelope = `${JSON.stringify({"event_id": event.event_id})}\n${JSON.stringify(event)}\n`;
      
      // Try the /envelope/ endpoint
      const url = 'https://gt.bm.onlydaniel.me/api/1/envelope/';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-sentry-envelope',
          'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=037a152fa3d04dd486d0e93d6c6e502e, sentry_client=custom-api-test/1.0`
        },
        body: envelope
      });

      const responseText = await response.text();
      
      setStatus(`Envelope endpoint response: ${response.status} ${response.statusText}`);
      setResponse((prev) => `${prev || ''}\n\nEnvelope endpoint: ${responseText || 'No response body'}`);
      
      return { success: response.ok, status: response.status, text: responseText };
    } catch (error) {
      console.error('Envelope endpoint error:', error);
      return { success: false, error };
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