'use client';

import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ProductImage({ src, alt, className }: ProductImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className='object-cover'
        sizes='(max-width: 768px) 64px, 128px'
      />
    </div>
  );
}
