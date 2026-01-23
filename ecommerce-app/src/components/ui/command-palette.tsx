'use client';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Product } from '@/lib/types';
import { Heart, Home, Loader2, Moon, Search, ShoppingCart, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const CommandPalette = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle the menu when the user presses Ctrl+K or Command+K
  useEffect(() => {
    if (!mounted) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [mounted]);

  // Fetch search results when query changes (with debounce)
  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/search?query=${query}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error('Command palette search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchResults, 300); // 300ms debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!mounted) return null;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {isLoading && query.length > 1 && (
          <div className="p-4 flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
          </div>
        )}
        {!isLoading && results.length > 0 && (
          <CommandGroup heading="Products">
            {results.map((product) => (
              <CommandItem
                key={product.id}
                onSelect={() => runCommand(() => router.push(`/products/${product.id}`))}
                value={`product-${product.id}-${product.title}`}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>{product.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push('/'))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/cart'))}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Cart</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/wishlist'))}>
            <Heart className="mr-2 h-4 w-4" />
            <span>Wishlist</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() => setTheme(theme === 'light' ? 'dark' : 'light'))
            }
          >
            {theme === 'light' ? (
              <Moon className="mr-2 h-4 w-4" />
            ) : (
              <Sun className="mr-2 h-4 w-4" />
            )}
            <span>Toggle Theme</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};