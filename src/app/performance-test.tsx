'use client';

import * as Sentry from '@sentry/nextjs';
import { useState } from 'react';

export default function PerformanceTest() {
  const [status, setStatus] = useState<string | null>(null);

  const simulateSlowOperation = () => {
    setStatus('Starting performance test...');
    
    // Create a custom span to measure performance
    const startTime = Date.now();
    
    // Simulate CPU-intensive work
    for (let i = 0; i < 5000000; i++) {
      Math.sqrt(i); // Remove the result variable assignment
    }
    
    // Simulate a delay like a database query
    setTimeout(() => {
      const duration = Date.now() - startTime;
      
      // Send performance data to GlitchTip
      Sentry.captureMessage('Performance Test Completed', {
        level: 'info',
        tags: {
          operation: 'performance_test',
          duration_ms: duration.toString(),
        },
      });
      
      // Also send an error message since performance data is arriving
      setTimeout(() => {
        try {
          Sentry.captureMessage("Test error from performance component", { 
            level: "error",
            tags: {
              test_type: 'error_from_perf',
              timestamp: Date.now().toString()
            }
          });
          console.log('Error message sent from performance test');
        } catch (e) {
          console.error('Failed to send error from performance test:', e);
        }
      }, 500);
      
      setStatus(`Performance test complete! Time: ${duration}ms`);
    }, 1000);
  };

  // Add a function to simulate frontend navigation (which is automatically tracked)
  const simulateNavigation = () => {
    setStatus('Simulating page navigation event...');
    
    // This will trigger a browser navigation performance event
    window.location.hash = Date.now().toString();
    
    // Also send an error event on navigation
    setTimeout(() => {
      try {
        console.log('Sending navigation error');
        Sentry.captureException(new Error(`Navigation error test at ${new Date().toISOString()}`));
      } catch (e) {
        console.error('Failed to send navigation error:', e);
      }
      
      setStatus('Navigation event recorded in GlitchTip');
    }, 500);
  };

  return (
    <div className="p-4 mt-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Performance Monitoring Test</h2>
      <div className="space-y-4">
        <div>
          <button 
            onClick={simulateSlowOperation}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          >
            Test CPU Performance + Error
          </button>
          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
            Simulates high CPU usage and sends metrics + error
          </p>
        </div>
        
        <div>
          <button 
            onClick={simulateNavigation}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Test Navigation + Error
          </button>
          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
            Simulates browser navigation which is automatically tracked + sends error
          </p>
        </div>
      </div>
      
      {status && (
        <div className="mt-4 p-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded">
          {status}
        </div>
      )}
    </div>
  );
} 