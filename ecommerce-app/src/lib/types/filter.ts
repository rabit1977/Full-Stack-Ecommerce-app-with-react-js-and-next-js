import { CategoryHierarchy } from './product';

export interface FilterSidebarProps {
  categories: (string | CategoryHierarchy)[];
  brands: string[];
  currentCategories: string; // Comma-separated string
  currentSubCategories: string;
  currentBrands: string;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  onCategoriesChange: (categories: string[]) => void;
  onSubCategoriesChange: (subCategories: string[]) => void;
  onBrandsChange: (brands: string[]) => void;
  onPriceChange: (priceRange: [number, number]) => void;
  className?: string;
  showFilterCount?: boolean;
}

export interface CategoryFilterProps {
  categories: (string | CategoryHierarchy)[];
  selectedCategories: Set<string>;
  selectedSubCategories: Set<string>;
  onCategoryToggle: (category: string, checked: boolean) => void;
  onSubCategoryToggle: (subCategory: string, checked: boolean) => void;
  isPending: boolean;
  showFilterCount?: boolean;
}

export interface BrandFilterProps {
  brands: string[];
  selectedBrands: Set<string>;
  onBrandToggle: (brand: string, checked: boolean) => void;
  isPending: boolean;
  showFilterCount: boolean;
}

export interface PriceFilterProps {
  localPriceRange: [number, number];
  onValueChange: (value: number[]) => void;
  onValueCommit: (value: number[]) => void;
  isPending: boolean;
  showFilterCount: boolean;
  isActive: boolean;
}