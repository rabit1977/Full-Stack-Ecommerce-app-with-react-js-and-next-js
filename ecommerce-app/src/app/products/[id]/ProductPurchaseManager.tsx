'use client';

import { ProductPurchasePanel } from '@/components/product/product-purchase-panel';
import { Product } from '@/lib/types';
import { useState, useMemo } from 'react';

interface ProductPurchaseManagerProps {
  product: Product;
}

export function ProductPurchaseManager({ product }: ProductPurchaseManagerProps) {
  // Set default options
  const defaultOptions = useMemo(() => {
    const options: Record<string, string> = {};
    if (product.options) {
      for (const option of product.options) {
        if (option.variants.length > 0) {
          options[option.name] = option.variants[0].value;
        }
      }
    }
    return options;
  }, [product.options]);

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>(defaultOptions);

  const handleOptionChange = (optionName: string, optionValue: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: optionValue,
    }));
  };

  return (
    <ProductPurchasePanel
      product={product}
      selectedOptions={selectedOptions}
      onOptionChange={handleOptionChange}
    />
  );
}
