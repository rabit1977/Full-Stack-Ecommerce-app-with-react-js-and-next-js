import { ProductWithRelations } from './product';

export interface QuickViewState {
  quantity: number;
  adding: boolean;
  added: boolean;
  selectedOptions: Record<string, string>;
  activeImage: string;
}

export interface ImageGalleryProps {
  images: string[];
  activeImage: string;
  onImageChange: (image: string) => void;
  productTitle: string;
}

export interface ProductInfoProps {
  product: ProductWithRelations;
}

export interface ProductOptionsProps {
  options: ProductWithRelations['options'];
  selectedOptions: Record<string, string>;
  onOptionChange: (optionName: string, optionValue: string) => void;
  validationError?: string;
}

export interface QuantitySelectorProps {
  quantity: number;
  maxStock: number;
  onQuantityChange: (quantity: number) => void;
  disabled?: boolean;
}

export interface AddToCartButtonProps {
  isOutOfStock: boolean;
  isAdding: boolean;
  isAdded: boolean;
  onAddToCart: () => void;
}
