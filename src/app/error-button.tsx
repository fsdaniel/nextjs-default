'use client';

import React from 'react';

export default function ErrorButton() {
  const throwError = () => {
    throw new Error("Generic Error Message");
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Test Sentry Error Reporting</h2>
      <button 
        onClick={throwError} 
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Throw Generic Error Message
      </button>
    </div>
  );
} 