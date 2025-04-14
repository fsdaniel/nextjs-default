'use client';

import { useState } from 'react';

export default function AdvancedErrorTest() {
  const [status, setStatus] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const logMessage = (message: string) => {
    setLogs(prev => [...prev, message]);
    console.log(message);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testOnerror = () => {
    setStatus('Testing window.onerror...');
    
    // Backup the existing handler if any
    const originalOnError = window.onerror;
    
    try {
      logMessage('Setting up custom onerror handler');
      window.onerror = function(message, source, lineno, colno, error) {
        logMessage(`onerror captured: ${message}`);
        return false; // Let the error propagate
      };
      
      // Trigger an error
      logMessage('Triggering error via syntax...');
      setTimeout(() => {
        // @ts-ignore - Intentionally causing an error
        const a = nonExistentVariable;
      }, 10);
      
      // Restore original handler after a delay
      setTimeout(() => {
        window.onerror = originalOnError;
        logMessage('Restored original onerror handler');
      }, 1000);
      
    } catch (error) {
      logMessage(`Setup error: ${error instanceof Error ? error.message : String(error)}`);
      window.onerror = originalOnError;
    }
  };

  const testThrow = () => {
    setStatus('Testing direct throw...');
    
    try {
      logMessage('Throwing error directly');
      throw new Error('Direct thrown error at ' + new Date().toISOString());
    } catch (error) {
      logMessage(`Caught error: ${error instanceof Error ? error.message : String(error)}`);
      // Re-throw to let it bubble up to global handlers
      setTimeout(() => {
        logMessage('Re-throwing error');
        throw error;
      }, 100);
    }
  };

  const testConsoleError = () => {
    setStatus('Testing console.error...');
    
    // Create a stack trace
    const error = new Error('Console error test at ' + new Date().toISOString());
    
    logMessage('Logging error to console');
    console.error('Console error test:', error);
  };

  return (
    <div className="p-4 mt-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Advanced Error Testing</h2>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={testOnerror}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            Test window.onerror
          </button>
          <button
            onClick={testThrow}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Test Direct Throw
          </button>
          <button
            onClick={testConsoleError}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            Test console.error
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