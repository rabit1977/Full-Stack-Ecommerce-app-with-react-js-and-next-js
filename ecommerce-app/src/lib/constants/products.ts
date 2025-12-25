// src/constants/products.ts

import { Product } from '../types';

export const initialProducts: Product[] = [
  // ============================================
  // TVs (Телевизори)
  // ============================================
  {
    id: 'sku-tv-001',
    title: 'Samsung Crystal UHD 55" TV',
    brand: 'Samsung',
    price: 45999,
    rating: 4.7,
    reviewCount: 156,
    category: 'TVs',
    stock: 8,
    discount: 10,
    description:
      'Crystal Display technology with 4K resolution, HDR support, and Smart TV functions. Perfect for a home cinema experience.',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-tv-002',
    title: 'Sony Bravia 65" OLED TV',
    brand: 'Sony',
    price: 89,
    rating: 4.9,
    reviewCount: 203,
    category: 'TVs',
    stock: 5,
    discount: 15,
    description:
      'OLED technology for perfect blacks, Dolby Vision HDR, 120Hz refresh rate, and built-in Google TV features.',
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-tv-003',
    title: 'Grundig 75" 4K Smart TV',
    brand: 'Grundig',
    price: 679,
    rating: 4.6,
    reviewCount: 124,
    category: 'TVs',
    stock: 4,
    description:
      'Massive 75" screen with 4K Ultra HD resolution, Smart functions, and a built-in soundbar for an enhanced audio experience.',
    images: [
      'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  // NEWLY ADDED
  {
    id: 'sku-tv-004',
    title: 'LG OLED C3 55" 4K Smart TV',
    brand: 'LG',
    price: 729.99,
    rating: 4.8,
    reviewCount: 95,
    category: 'TVs',
    stock: 10,
    description:
      'The advanced LG OLED evo processor delivers brighter colors and deeper contrast. Ideal for gaming with 0.1ms response time.',
    images: [
      'https://images.unsplash.com/photo-1577979749830-f1d742b96791?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1577979749830-f1d742b96791?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },

  // ============================================
  // HOME AUDIO (Домашно Аудио)
  // ============================================
  {
    id: 'sku-audio-001',
    title: 'Samsung HW-Q800B Soundbar',
    brand: 'Samsung',
    price: 349.99,
    rating: 4.8,
    reviewCount: 189,
    category: 'Home Audio',
    stock: 12,
    description:
      '3.1.2 channel soundbar with Dolby Atmos, wireless subwoofer, and Q-Symphony technology for synchronization with Samsung TVs.',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-audio-002',
    title: 'Sony MHC-V73D Music System',
    brand: 'Sony',
    price: 289.99,
    rating: 4.7,
    reviewCount: 98,
    category: 'Home Audio',
    stock: 7,
    description:
      'Powerful music system with 360° Sound, DJ effects, karaoke function, and Bluetooth connectivity. Perfect for parties.',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },

  // ============================================
  // PERSONAL AUDIO (Персонално Аудио)
  // ============================================
  {
    id: 'sku-headphones-001',
    title: 'Sony WH-1000XM5 Headphones',
    brand: 'Sony',
    price: 229.99,
    rating: 4.9,
    reviewCount: 456,
    category: 'Personal Audio',
    stock: 15,
    description:
      'Premium wireless headphones with industry-leading active noise cancellation, 30-hour battery life, and Hi-Res Audio.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-headphones-002',
    title: 'Samsung Galaxy Buds2 Pro',
    brand: 'Samsung',
    price: 129.99,
    rating: 4.7,
    reviewCount: 342,
    category: 'Personal Audio',
    stock: 25,
    description:
      'True Wireless earbuds with Intelligent ANC, 360 Audio, IPX7 water resistance, and 8-hour battery life.',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-speaker-001',
    title: 'Sony SRS-XB43 Portable Speaker',
    brand: 'Sony',
    price: 89.99,
    rating: 4.6,
    reviewCount: 178,
    category: 'Personal Audio',
    stock: 18,
    description:
      'Powerful portable speaker with EXTRA BASS, IP67 water resistance, 24-hour battery life, and LED lighting.',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  // NEWLY ADDED
  {
    id: 'sku-headphones-003',
    title: 'Apple AirPods Pro (2nd Gen)',
    brand: 'Apple',
    price: 169.99,
    rating: 4.9,
    reviewCount: 520,
    category: 'Personal Audio',
    stock: 30,
    description:
      'Rich audio quality, up to 2x more Active Noise Cancellation, and Adaptive Transparency. Personalized Spatial Audio.',
    images: [
      'https://images.unsplash.com/photo-1588940086836-36c7d89611a0?q=80&w=1170&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=500&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },

  // ============================================
  // ACCESSORIES (Галантерија)
  // ============================================
  {
    id: 'sku-mount-001',
    title: 'Meliconi SlimStyle 600 SDR TV Mount',
    brand: 'Meliconi',
    price: 39.99,
    rating: 4.8,
    reviewCount: 267,
    category: 'Accessories',
    stock: 30,
    description:
      'Fixed wall mount for TVs 32"-80", load capacity up to 80kg, VESA compatible, ultra-slim design.',
    images: [
      'https://www.dagimarket.com/1954620-large_default/meliconi-slimstyle-plus-600-sdr-208-m-82-black.jpg',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1607969653739-c5f9cac5cf57?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-remote-001',
    title: 'Samsung BN59 Remote Control',
    brand: 'Samsung',
    price: 14.99,
    rating: 4.5,
    reviewCount: 89,
    category: 'Accessories',
    stock: 45,
    description:
      'Original Samsung remote control, compatible with most Samsung Smart TV models.',
    images: [
      'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-cable-001',
    title: 'HDMI 2.1 Cable 2m',
    brand: 'Meliconi',
    price: 89.9,
    rating: 4.7,
    reviewCount: 156,
    category: 'Accessories',
    stock: 100,
    description:
      'High-quality HDMI 2.1 cable, supporting 8K@60Hz and 4K@120Hz, eARC, 48Gbps speed.',
    images: [
      'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-battery-001',
    title: 'Duracell AA Batteries (4-pack)',
    brand: 'Duracell',
    price: 5.99,
    rating: 4.9,
    reviewCount: 412,
    category: 'Accessories',
    stock: 80,
    description:
      'Long-life alkaline batteries, ideal for remote controls, toys, and other devices.',
    images: [
      'https://images.unsplash.com/photo-1576834975354-ee694be1f0d1?q=80&w=1170&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1626885930974-4b69aa21bbf3?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },

  // ============================================
  // SMART DEVICES (Паметни Уреди)
  // ============================================
  {
    id: 'sku-camera-001',
    title: 'Samsung SmartCam A1 Surveillance Camera',
    brand: 'Samsung',
    price: 699.9,
    rating: 4.6,
    reviewCount: 145,
    category: 'Smart Devices',
    stock: 15,
    description:
      'HD surveillance camera with night vision, two-way audio, motion detection, and Cloud recording.',
    images: [
      'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-sensor-001',
    title: 'Smart Motion Sensor',
    brand: 'Samsung',
    price: 24.99,
    rating: 4.5,
    reviewCount: 78,
    category: 'Smart Devices',
    stock: 35,
    description:
      'Wireless motion sensor with SmartThings integration, automatic light switching, and notifications.',
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },

  // ============================================
  // COMPUTERS (Компјутери)
  // ============================================
  {
    id: 'sku-laptop-001',
    title: 'Dell XPS 15 Laptop',
    brand: 'Dell',
    price: 899.99,
    rating: 4.8,
    reviewCount: 234,
    category: 'Computers',
    stock: 6,
    description:
      '15.6" FHD+ InfinityEdge display, Intel Core i7-13700H, 16GB RAM, 512GB SSD, NVIDIA RTX 4050.',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-laptop-002',
    title: 'HP Pavilion Gaming Laptop',
    brand: 'HP',
    price: 659.99,
    rating: 4.6,
    reviewCount: 178,
    category: 'Computers',
    stock: 9,
    description:
      '15.6" FHD 144Hz display, AMD Ryzen 7 5800H, 16GB RAM, 512GB SSD, NVIDIA GTX 1660 Ti.',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-desktop-001',
    title: 'Gaming Desktop PC i7/RTX 4070',
    brand: 'Custom',
    price: 1199.99,
    rating: 4.9,
    reviewCount: 92,
    category: 'Computers',
    stock: 4,
    description:
      'Intel Core i7-13700K, 32GB DDR5 RAM, 1TB NVMe SSD, NVIDIA RTX 4070 12GB, RGB lighting.',
    images: [
      'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  // NEWLY ADDED
  {
    id: 'sku-laptop-003',
    title: 'Apple MacBook Air M2 13.6"',
    brand: 'Apple',
    price: 799.99,
    rating: 4.9,
    reviewCount: 310,
    category: 'Computers',
    stock: 12,
    description:
      'Supercharged by the M2 chip. 13.6-inch Liquid Retina display, 8GB RAM, 256GB SSD, and up to 18 hours of battery life.',
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },

  // ============================================
  // PHONES & WATCHES (Телефони и Часовници)
  // ============================================
  {
    id: 'sku-phone-001',
    title: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 749.99,
    rating: 4.9,
    reviewCount: 567,
    category: 'Phones & Watches',
    stock: 12,
    description:
      '6.8" Dynamic AMOLED 2X display, Snapdragon 8 Gen 3, 12GB RAM, 256GB storage, 200MP camera, S Pen.',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-phone-002',
    title: 'Samsung Galaxy A54 5G',
    brand: 'Samsung',
    price: 299.99,
    rating: 4.7,
    reviewCount: 389,
    category: 'Phones & Watches',
    stock: 25,
    description:
      '6.4" Super AMOLED display, Exynos 1380, 8GB RAM, 256GB storage, 50MP OIS camera, 5000mAh battery.',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-watch-001',
    title: 'Samsung Galaxy Watch 6',
    brand: 'Samsung',
    price: 19.99,
    rating: 4.8,
    reviewCount: 245,
    category: 'Phones & Watches',
    stock: 18,
    description:
      '1.5" Super AMOLED screen, advanced health tracking, sleep monitoring, GPS, LTE support.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  // NEWLY ADDED
  {
    id: 'sku-phone-003',
    title: 'Apple iPhone 15 Pro Max',
    brand: 'Apple',
    price: 899.99,
    rating: 4.9,
    reviewCount: 850,
    category: 'Phones & Watches',
    stock: 8,
    description:
      'Titanium design, A17 Pro chip, 48MP Main camera, USB-C, and all-day battery life.',
    images: [
      'https://images.unsplash.com/photo-1709178295038-acbeec786fcf?q=80&w=1227&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1700805732158-6f1169780ca7?q=80&w=687&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },

  // ============================================
  // CAMERAS (Фото Апарати и Камери)
  // ============================================
  {
    id: 'sku-camera-002',
    title: 'Sony Alpha A7 IV Camera',
    brand: 'Sony',
    price: 1499.99,
    rating: 4.9,
    reviewCount: 178,
    category: 'Cameras',
    stock: 3,
    description:
      '33MP Full-Frame sensor, 4K 60p video, 5-axis stabilization, fast autofocus with AI.',
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-camera-003',
    title: 'Canon EOS R6 Mark II',
    brand: 'Canon',
    price: 1699.99,
    rating: 4.8,
    reviewCount: 134,
    category: 'Cameras',
    stock: 2,
    description:
      '24.2MP Full-Frame sensor, 6K RAW video, up to 40fps continuous shooting, Dual Pixel AF II.',
    images: [
      'https://1.img-dpreview.com/files/p/E~TS1180x0~articles/7539266175/Canon-EOS-R6-II-images/Canon_EOS_R6_II_front.jpeg',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1606980462651-13d36c24c2a0?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  // NEWLY ADDED
  {
    id: 'sku-camera-005',
    title: 'GoPro HERO 12 Black',
    brand: 'GoPro',
    price: 249.99,
    rating: 4.7,
    reviewCount: 210,
    category: 'Cameras',
    stock: 20,
    description:
      'Incredible image quality, even better HyperSmooth video stabilization, and huge battery life.',
    images: [
      'https://images.unsplash.com/photo-1594910609322-8d77d130386e?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1594910609322-8d77d130386e?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },

  // ============================================
  // GAMING
  // ============================================
  {
    id: 'sku-console-001',
    title: 'Sony PlayStation 5',
    brand: 'Sony',
    price: 399.99,
    rating: 4.9,
    reviewCount: 678,
    category: 'Gaming',
    stock: 8,
    description:
      'Next-generation console with ultra-fast SSD, 4K gaming up to 120fps, Ray Tracing, DualSense controller.',
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-gaming-001',
    title: 'Razer BlackWidow V4 Pro Keyboard',
    brand: 'Razer',
    price: 129.99,
    rating: 4.8,
    reviewCount: 234,
    category: 'Gaming',
    stock: 15,
    description:
      'Mechanical gaming keyboard with Razer Green switches, RGB lighting, and programmable keys.',
    images: [
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-gaming-002',
    title: 'Logitech G Pro X Superlight Mouse',
    brand: 'Logitech',
    price: 89.99,
    rating: 4.9,
    reviewCount: 456,
    category: 'Gaming',
    stock: 22,
    description:
      'Ultra-light wireless gaming mouse (under 63g), HERO 25K sensor, 70+ hours of battery life.',
    images: [
      'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  // NEWLY ADDED
  {
    id: 'sku-console-003',
    title: 'Nintendo Switch OLED Model',
    brand: 'Nintendo',
    price: 219.99,
    rating: 4.8,
    reviewCount: 330,
    category: 'Gaming',
    stock: 12,
    description:
      '7-inch OLED screen, wide adjustable stand, wired LAN port, 64 GB internal storage, and enhanced audio.',
    images: [
      'https://images.unsplash.com/photo-1749135583881-1c12ee0f6134?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1578303512597-81de837554e2?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  // ============================================
  // MORE ТЕЛЕВИЗОРИ (TVs)
  // ============================================
  {
    id: 'sku-tv-007',
    title: 'LG OLED evo C3 55" Smart TV',
    brand: 'LG',
    price: 799.99,
    rating: 4.8,
    reviewCount: 289,
    category: 'TVs',
    stock: 6,
    discount: 12,
    description:
      'OLED evo technology with Brightness Booster, α9 AI Processor Gen6, Dolby Vision IQ, perfect for gaming with 120Hz and VRR.',
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-tv-005',
    title: 'TCL 43" 4K QLED Smart TV',
    brand: 'TCL',
    price: 329.99,
    rating: 4.5,
    reviewCount: 167,
    category: 'TVs',
    stock: 12,
    description:
      'Quantum Dot technology, HDR10+, Google TV built-in, voice control with hands-free feature, game mode with low latency.',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-tv-006',
    title: 'Philips 50" Ambilight 4K TV',
    brand: 'Philips',
    price: 419.99,
    rating: 4.6,
    reviewCount: 198,
    category: 'TVs',
    stock: 9,
    description:
      'Unique 3-sided Ambilight technology, P5 Perfect Picture Engine, Android TV, Dolby Vision & Atmos support.',
    images: [
      'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },

  // ============================================
  // MORE ДОМАШНО АУДИО (Home Audio)
  // ============================================
  {
    id: 'sku-audio-003',
    title: 'LG S90QY 5.1.3ch Soundbar',
    brand: 'LG',
    price: 429.99,
    rating: 4.7,
    reviewCount: 145,
    category: 'Home Audio',
    stock: 8,
    description:
      '5.1.3 channel soundbar with Dolby Atmos, DTS:X, wireless subwoofer, rear speakers included, AI Sound Pro.',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-audio-004',
    title: 'Bose Smart Soundbar 900',
    brand: 'Bose',
    price: 549.99,
    rating: 4.9,
    reviewCount: 312,
    category: 'Home Audio',
    stock: 5,
    description:
      'Premium soundbar with Dolby Atmos, spatial audio technology, voice assistants built-in, AdaptIQ audio calibration.',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-audio-005',
    title: 'JBL PartyBox 310 Party Speaker',
    brand: 'JBL',
    price: 249.99,
    rating: 4.8,
    reviewCount: 223,
    category: 'Home Audio',
    stock: 11,
    description:
      'Powerful portable party speaker with 240W output, dynamic light show, mic and guitar inputs, IPX4 splashproof, 18h battery.',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },

  // ============================================
  // MORE ПЕРСОНАЛНО АУДИО (Personal Audio)
  // ============================================
  {
    id: 'sku-headphones-004',
    title: 'Bose QuietComfort 45 Headphones',
    brand: 'Bose',
    price: 189.99,
    rating: 4.8,
    reviewCount: 567,
    category: 'Personal Audio',
    stock: 20,
    description:
      'World-class noise cancellation, premium comfort, up to 24 hours battery life, TriPort acoustic architecture.',
    images: [
      'https://images.unsplash.com/photo-1628911773925-2586d87f2b5c?q=80&w=1170&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1546435770-a3e426bf4022?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-headphones-005',
    title: 'Apple AirPods Pro 2nd Gen',
    brand: 'Apple',
    price: 169.99,
    rating: 4.9,
    reviewCount: 892,
    category: 'Personal Audio',
    stock: 30,
    description:
      'Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio, MagSafe charging case, up to 30h total battery.',
    images: [
      'https://images.unsplash.com/photo-1593442607435-e4e34991b210?q=80&w=1170&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-speaker-002',
    title: 'JBL Flip 6 Portable Speaker',
    brand: 'JBL',
    price: 69.99,
    rating: 4.7,
    reviewCount: 445,
    category: 'Personal Audio',
    stock: 28,
    description:
      'Bold JBL Original Pro Sound, IP67 waterproof and dustproof, 12 hours playtime, PartyBoost feature to pair multiple speakers.',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-speaker-003',
    title: 'Ultimate Ears BOOM 3 Speaker',
    brand: 'Ultimate Ears',
    price: 79.99,
    rating: 4.6,
    reviewCount: 334,
    category: 'Personal Audio',
    stock: 22,
    description:
      '360° immersive sound, IP67 waterproof & dustproof, 15h battery, Magic Button for music control, shockproof design.',
    images: [
      'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },

  // ============================================
  // MORE ГАЛАНТЕРИЈА (Accessories)
  // ============================================
  {
    id: 'sku-mount-002',
    title: 'Vogels WALL 3345 Full-Motion TV Mount',
    brand: 'Vogels',
    price: 69.99,
    rating: 4.9,
    reviewCount: 178,
    category: 'Accessories',
    stock: 15,
    description:
      'Full-motion wall mount for 40"-65" TVs, 180° swivel, 20° tilt, easy cable management, max 30kg weight capacity.',
    images: [
      'https://images.unsplash.com/photo-1607969653739-c5f9cac5cf57?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1607969653739-c5f9cac5cf57?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-antenna-001',
    title: 'Digital HD TV Antenna Indoor',
    brand: 'Meliconi',
    price: 19.99,
    rating: 4.5,
    reviewCount: 267,
    category: 'Accessories',
    stock: 40,
    description:
      'Amplified indoor antenna, receives 1080p HDTV signals, 80-mile range, supports VHF & UHF, easy setup with 16ft cable.',
    images: [
      'https://images.unsplash.com/photo-1606207084228-5d8f8c8e8c8c?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1606207084228-5d8f8c8e8c8c?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-cable-002',
    title: 'DisplayPort 1.4 Cable 2m',
    brand: 'Cable Matters',
    price: 12.99,
    rating: 4.8,
    reviewCount: 445,
    category: 'Accessories',
    stock: 75,
    description:
      'DisplayPort 1.4 cable supports 8K@60Hz, 4K@144Hz, HDR, G-SYNC & FreeSync, gold-plated connectors, braided design.',
    images: [
      'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-mic-001',
    title: 'Blue Yeti USB Microphone',
    brand: 'Blue',
    price: 89.99,
    rating: 4.8,
    reviewCount: 1234,
    category: 'Accessories',
    stock: 18,
    description:
      'Professional USB microphone for streaming, podcasting, and recording. Tri-capsule array, 4 pickup patterns, plug & play.',
    images: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-smartbox-001',
    title: 'Xiaomi Mi Box S 4K Streaming Box',
    brand: 'Xiaomi',
    price: 49.99,
    rating: 4.6,
    reviewCount: 567,
    category: 'Accessories',
    stock: 25,
    description:
      '4K HDR streaming box with Android TV 9.0, Google Assistant, Chromecast built-in, supports Netflix, Prime Video, YouTube.',
    images: [
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },

  // ============================================
  // MORE КОМПЈУТЕРИ (Computers)
  // ============================================
  {
    id: 'sku-laptop-005',
    title: 'ASUS ROG Zephyrus G14 Gaming Laptop',
    brand: 'ASUS',
    price: 949.99,
    rating: 4.9,
    reviewCount: 445,
    category: 'Computers',
    stock: 5,
    description:
      '14" QHD 165Hz display, AMD Ryzen 9 7940HS, 32GB RAM, 1TB SSD, NVIDIA RTX 4070, AniMe Matrix LED display.',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-laptop-004',
    title: 'MacBook Pro 14" M3 Pro',
    brand: 'Apple',
    price: 1299.99,
    rating: 4.9,
    reviewCount: 678,
    category: 'Computers',
    stock: 7,
    description:
      '14.2" Liquid Retina XDR, Apple M3 Pro chip, 18GB unified memory, 512GB SSD, up to 18 hours battery, ProMotion 120Hz.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-monitor-001',
    title: 'LG 27" UltraGear Gaming Monitor',
    brand: 'LG',
    price: 219.99,
    rating: 4.8,
    reviewCount: 334,
    category: 'Computers',
    stock: 14,
    description:
      '27" IPS QHD (2560x1440), 165Hz refresh rate, 1ms response time, NVIDIA G-SYNC Compatible, HDR10, height adjustable stand.',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-monitor-002',
    title: 'Samsung Odyssey G7 32" Curved Monitor',
    brand: 'Samsung',
    price: 349.99,
    rating: 4.7,
    reviewCount: 289,
    category: 'Computers',
    stock: 9,
    description:
      '32" QLED curved (1000R), 240Hz, 1ms response, G-SYNC & FreeSync Premium Pro, WQHD (2560x1440), HDR600.',
    images: [
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },

  // ============================================
  // MORE ТЕЛЕФОНИ И ЧАСОВНИЦИ (Phones & Watches)
  // ============================================
  {
    id: 'sku-phone-004',
    title: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: 849.99,
    rating: 4.9,
    reviewCount: 1234,
    category: 'Phones & Watches',
    stock: 10,
    description:
      '6.7" Super Retina XDR, A17 Pro chip, titanium design, 48MP camera system, Action button, USB-C, up to 29h video playback.',
    images: [
      'https://images.unsplash.com/photo-1708417015900-00e230b3b6f5?q=80&w=688&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1592286927505-2fd0fcbf6e1c?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-phone-005',
    title: 'Google Pixel 8 Pro',
    brand: 'Google',
    price: 599.99,
    rating: 4.8,
    reviewCount: 445,
    category: 'Phones & Watches',
    stock: 15,
    description:
      '6.7" LTPO OLED 120Hz, Google Tensor G3, 12GB RAM, 128GB storage, 50MP triple camera, 7 years of updates, Magic Eraser.',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-watch-002',
    title: 'Apple Watch Series 9',
    brand: 'Apple',
    price: 249.99,
    rating: 4.9,
    reviewCount: 789,
    category: 'Phones & Watches',
    stock: 20,
    description:
      '45mm case, Always-On Retina display, S9 SiP chip, Double Tap gesture, advanced health features, 18h battery, GPS + Cellular.',
    images: [
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-watch-003',
    title: 'Garmin Fenix 7X Solar Smartwatch',
    brand: 'Garmin',
    price: 499.99,
    rating: 4.8,
    reviewCount: 234,
    category: 'Phones & Watches',
    stock: 8,
    description:
      'Rugged multisport GPS watch, solar charging, topographic maps, 37-day battery life, advanced training metrics, sapphire lens.',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },

  // ============================================
  // MORE GAMING
  // ============================================
  {
    id: 'sku-console-002',
    title: 'Xbox Series X',
    brand: 'Microsoft',
    price: 389.99,
    rating: 4.8,
    reviewCount: 556,
    category: 'Gaming',
    stock: 10,
    description:
      'Most powerful Xbox ever, 12 teraflops GPU, 4K gaming up to 120fps, 1TB custom NVMe SSD, Quick Resume, backward compatible.',
    images: [
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-gaming-003',
    title: 'SteelSeries Arctis Nova Pro Wireless',
    brand: 'SteelSeries',
    price: 199.99,
    rating: 4.9,
    reviewCount: 345,
    category: 'Gaming',
    stock: 12,
    description:
      'Premium wireless gaming headset, dual-battery system, Active Noise Cancellation, 360° Spatial Audio, Hi-Res audio certified.',
    images: [
      'https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-gaming-004',
    title: 'Elgato Stream Deck MK.2',
    brand: 'Elgato',
    price: 89.99,
    rating: 4.8,
    reviewCount: 567,
    category: 'Gaming',
    stock: 16,
    description:
      '15 customizable LCD keys, control OBS, Twitch, YouTube, smart lighting, and more. Perfect for streamers and content creators.',
    images: [
      'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
  {
    id: 'sku-gaming-005',
    title: 'Secretlab Titan Evo Gaming Chair',
    brand: 'Secretlab',
    price: 299.99,
    rating: 4.9,
    reviewCount: 890,
    category: 'Gaming',
    stock: 6,
    description:
      'Award-winning ergonomic gaming chair, NEO Hybrid Leatherette, 4-way L-ADAPT lumbar support, magnetic memory foam pillows.',
    images: [
      'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },

  // ============================================
  // MORE ФОТО АПАРАТИ И КАМЕРИ (Cameras)
  // ============================================
  {
    id: 'sku-camera-004',
    title: 'GoPro HERO 12 Black Action Camera',
    brand: 'GoPro',
    price: 299.99,
    rating: 4.8,
    reviewCount: 678,
    category: 'Cameras',
    stock: 18,
    description:
      '5.3K60 video, 27MP photos, HyperSmooth 6.0 stabilization, waterproof to 10m, HDR video, TimeWarp 3.0, voice control.',
    images: [
      'https://images.unsplash.com/photo-1589561253898-768105ca91a8?q=80&w=800&auto=format&fit=crop',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1589561253898-768105ca91a8?q=80&w=800&auto=format&fit=crop',
    reviews: [],
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2025-12-01T12:00:00.000Z',
  },
];
