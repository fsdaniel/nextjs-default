'use client';

import { useState } from 'react';

export default function DsnTest() {
  const [status, setStatus] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
    console.log(message);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // Test if the DSN format is correct and analyze its components
  const testDsnFormat = () => {
    setStatus('Testing DSN format...');
    
    // The original DSN
    const dsn = 'https://037a152fa3d04dd486d0e93d6c6e502e@gt.bm.onlydaniel.me/1';
    
    try {
      addLog(`Original DSN: ${dsn}`);
      
      // Parse the DSN to extract its components
      // DSN format: {protocol}://{publicKey}@{host}/{projectId}
      const dsnRegex = /^(https?):\/\/([a-zA-Z0-9]+)@([^/]+)\/([0-9]+)$/;
      const match = dsn.match(dsnRegex);
      
      if (!match) {
        addLog('❌ DSN format is invalid');
        return;
      }
      
      const [, protocol, publicKey, host, projectId] = match;
      
      addLog(`✅ DSN format is valid`);
      addLog(`Protocol: ${protocol}`);
      addLog(`Public Key: ${publicKey}`);
      addLog(`Host: ${host}`);
      addLog(`Project ID: ${projectId}`);
      
      // Generate alternative DSN formats to try
      const altDsn1 = `${protocol}://${publicKey}:@${host}/${projectId}`;
      const altDsn2 = `${protocol}://${publicKey}@${host}:443/${projectId}`;
      
      addLog(`\nAlternative DSN formats to try:`);
      addLog(`1. With empty secret: ${altDsn1}`);
      addLog(`2. With explicit port: ${altDsn2}`);
      
      // Check for common issues
      if (!protocol.startsWith('http')) {
        addLog('⚠️ Protocol should be https for production');
      }
      
      if (host.includes('localhost') || host.includes('127.0.0.1')) {
        addLog('⚠️ Host is localhost - this might not work from browsers');
      }
      
      setStatus('DSN analysis complete');
    } catch (error) {
      addLog(`Error analyzing DSN: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('DSN analysis failed');
    }
  };

  // Try to directly initialize a separate Sentry instance
  const testDirectInitialization = () => {
    setStatus('Testing direct Sentry initialization...');
    
    try {
      addLog('Dynamically importing Sentry Browser SDK...');
      
      // Dynamically import the Sentry Browser SDK
      import('@sentry/browser').then(Sentry => {
        addLog('Sentry Browser SDK imported successfully');
        
        const dsn = 'https://037a152fa3d04dd486d0e93d6c6e502e@gt.bm.onlydaniel.me/1';
        
        // Initialize with basic options
        Sentry.init({
          dsn,
          debug: true,
          environment: 'test',
          beforeSend: (event) => {
            addLog(`Event prepared to send: ${event.event_id}`);
            return event;
          }
        });
        
        addLog('Sentry initialized with direct browser SDK');
        
        // Try to send a test event
        const eventId = Sentry.captureMessage('Direct Browser SDK Test', {
          level: 'error',
          tags: {
            source: 'direct_browser_sdk',
            timestamp: Date.now().toString()
          }
        });
        
        addLog(`Test event captured with ID: ${eventId}`);
        setStatus('Direct initialization test complete');
      }).catch(err => {
        addLog(`Failed to import Sentry Browser SDK: ${err.message}`);
        setStatus('Direct initialization failed');
      });
    } catch (error) {
      addLog(`Error in direct initialization: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('Direct initialization failed');
    }
  };

  return (
    <div className="p-4 mt-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">DSN and Initialization Testing</h2>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={testDsnFormat}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Test DSN Format
          </button>
          <button
            onClick={testDirectInitialization}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Test Direct Init
          </button>
          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Clear Logs
          </button>
        </div>
        
        {status && (
          <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded">
            {status}
          </div>
        )}
        
        {logs.length > 0 && (
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded font-mono text-xs whitespace-pre-wrap overflow-auto max-h-60">
            {logs.map((log, index) => (
              <div key={index} className="border-b border-gray-300 dark:border-gray-600 py-1 last:border-0">
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 