import { Product } from '@/generated/prisma/browser';

export interface SearchState {
  inputValue: string;
  isSearchFocused: boolean;
  searchResults: Product[];
  isLoading: boolean;
}

export interface SearchResultItem {
  product: Product;
  index: number;
  onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => void;
}
