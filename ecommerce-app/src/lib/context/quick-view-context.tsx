'use client';

import { ProductWithRelations } from '@/lib/types';
import { createContext, useContext, useState, ReactNode } from 'react';

interface QuickViewContextType {
  isOpen: boolean;
  product: ProductWithRelations | null;
  openModal: (product: ProductWithRelations) => void;
  closeModal: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(
  undefined
);

export const QuickViewProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<ProductWithRelations | null>(null);

  const openModal = (product: ProductWithRelations) => {
    setProduct(product);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setProduct(null);
  };

  return (
    <QuickViewContext.Provider
      value={{ isOpen, product, openModal, closeModal }}
    >
      {children}
    </QuickViewContext.Provider>
  );
};

export const useQuickView = () => {
  const context = useContext(QuickViewContext);
  if (context === undefined) {
    throw new Error('useQuickView must be used within a QuickViewProvider');
  }
  return context;
};
