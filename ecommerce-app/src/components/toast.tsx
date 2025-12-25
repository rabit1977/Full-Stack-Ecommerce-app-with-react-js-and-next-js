'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, XCircle } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';

const Toast = () => {
  const { toast } = useAppSelector((state) => state.ui);

  const iconMap = {
    success: <Check className="h-5 w-5 text-green-400" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  return (
    <AnimatePresence>
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          exit={{ opacity: 0, y: 20, scale: 0.9 }} 
          className="fixed bottom-16 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full bg-slate-900 text-white py-2 px-5 shadow-lg z-50 dark:bg-slate-50 dark:text-slate-900"
        >
          {iconMap[toast.type]}
          <p className="text-sm font-medium">{toast.message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Toast };
