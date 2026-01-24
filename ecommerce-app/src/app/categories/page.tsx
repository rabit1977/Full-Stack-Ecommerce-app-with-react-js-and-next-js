import { prisma } from '@/lib/db';
import {
    Camera,
    Gamepad2,
    Headphones,
    Keyboard,
    Laptop,
    Monitor,
    Smartphone,
    Speaker,
    Tv,
    Watch
} from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse products by category',
};

// Map category names to icons
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'TVs': Tv,
  'Laptops': Laptop,
  'Phones': Smartphone,
  'Audio': Headphones,
  'Cameras': Camera,
  'Gaming': Gamepad2,
  'Wearables': Watch,
  'Monitors': Monitor,
  'Speakers': Speaker,
  'Accessories': Keyboard,
};

// Map category names to gradient colors
const categoryColors: Record<string, string> = {
  'TVs': 'from-purple-500 to-indigo-600',
  'Laptops': 'from-blue-500 to-cyan-500',
  'Phones': 'from-pink-500 to-rose-500',
  'Audio': 'from-amber-500 to-orange-500',
  'Cameras': 'from-emerald-500 to-teal-500',
  'Gaming': 'from-violet-500 to-purple-600',
  'Wearables': 'from-cyan-500 to-blue-500',
  'Monitors': 'from-slate-600 to-slate-800',
  'Speakers': 'from-red-500 to-pink-500',
  'Accessories': 'from-gray-500 to-gray-700',
};

async function getCategories() {
  const categories = await prisma.product.groupBy({
    by: ['category'],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
  });

  return categories.map((cat) => ({
    name: cat.category,
    count: cat._count.id,
  }));
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className='page-wrapper'>
      <div className='container-wide py-12 sm:py-16 lg:py-20'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4'>
            Shop by Category
          </h1>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Explore our curated collection of premium electronics across all categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.name] || Monitor;
            const gradient = categoryColors[category.name] || 'from-primary to-primary/80';
            
            return (
              <Link
                key={category.name}
                href={`/products?categories=${encodeURIComponent(category.name)}`}
                className='group relative overflow-hidden rounded-2xl aspect-square transition-all duration-300 hover:scale-[1.02] hover:shadow-xl'
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
                
                {/* Pattern Overlay */}
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15)_0%,transparent_50%)]' />
                
                {/* Content */}
                <div className='relative h-full flex flex-col items-center justify-center p-4 text-white'>
                  <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300'>
                    <Icon className='w-8 h-8 sm:w-10 sm:h-10' />
                  </div>
                  <h3 className='text-lg sm:text-xl font-bold mb-1 text-center'>
                    {category.name}
                  </h3>
                  <p className='text-sm text-white/80'>
                    {category.count} {category.count === 1 ? 'product' : 'products'}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className='absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2'>
                  <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {/* All Products Link */}
        <div className='text-center mt-12'>
          <Link
            href='/products'
            className='inline-flex items-center gap-2 text-primary font-semibold hover:underline'
          >
            View All Products
            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
