'use client';

import { ProductPurchasePanel } from '@/components/product/product-purchase-panel';
import { ProductOption, ProductWithRelations } from '@/lib/types';

import { useMemo, useState } from 'react';

export interface ProductPurchaseManagerProps {
  product: ProductWithRelations;
  initialIsWished: boolean;
  initialQuantityInCart: number;
}

/**
 * Type guard to check if options are valid ProductOption array
 */
function isValidProductOptions(options: unknown): options is ProductOption[] {
  if (!Array.isArray(options)) return false;

  return options.every(
    (option) =>
      option &&
      typeof option === 'object' &&
      'name' in option &&
      'variants' in option &&
      Array.isArray(option.variants) &&
      option.variants.every(
        (variant: unknown) =>
          variant && typeof variant === 'object' && 'value' in variant,
      ),
  );
}

/**
 * ProductPurchaseManager Component
 *
 * Manages product variant selection and passes state to the purchase panel
 * Handles product options (size, color, etc.) with proper type safety
 */
export function ProductPurchaseManager({
  product,
  initialIsWished,
  initialQuantityInCart,
}: ProductPurchaseManagerProps) {
  /**
   * Set default selected options from first variant of each option
   */
  const defaultOptions = useMemo(() => {
    const options: Record<string, string> = {};

    // Type guard check for product options
    if (isValidProductOptions(product.options)) {
      for (const option of product.options) {
        // Select first variant as default
        if (option.variants && option.variants.length > 0) {
          options[option.name] = option.variants[0].value;
        }
      }
    }

    return options;
  }, [product.options]);

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>(defaultOptions);

  /**
   * Handle option change (e.g., user selects "Large" for "Size")
   */
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
      initialIsWished={initialIsWished}
      initialQuantityInCart={initialQuantityInCart}
    />
  );
}
