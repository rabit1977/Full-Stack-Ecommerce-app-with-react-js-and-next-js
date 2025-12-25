'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const DataRecovery = () => {
  const [showRecovery, setShowRecovery] = useState(false);

  // Check if data might be corrupted
  const checkDataHealth = () => {
    try {
      const products = localStorage.getItem('products');
      if (products) {
        const parsed = JSON.parse(products);
        // Simple check for data health
        if (!Array.isArray(parsed) || parsed.length === 0) {
          setShowRecovery(true);
        }
      }
    } catch (e) {
      setShowRecovery(true);
    }
  };

  // Run check on component mount
  useState(() => {
    checkDataHealth();
  });

  const resetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (!showRecovery) return null;

  return (
    <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 p-4 rounded shadow-lg z-50 max-w-sm">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-5 w-5 text-yellow-600" />
        <h3 className="font-bold text-yellow-800">Data Issue Detected</h3>
      </div>
      <p className="text-yellow-700 text-sm mb-3">
        There seems to be an issue with your stored data. This can happen after browser updates or clearing cookies.
      </p>
      <Button 
        onClick={resetData} 
        size="sm" 
        variant="outline"
        className="w-full"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Reset Application Data
      </Button>
    </div>
  );
};

export { DataRecovery };