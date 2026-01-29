'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    CreditCard,
    Facebook,
    Instagram,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Send,
    Shield,
    Truck,
    Twitter,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState, useTransition } from 'react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
  color: string;
}

const footerLinks: FooterSection[] = [
  {
    title: 'Shop',
    links: [
      { label: 'TVs & Displays', href: '/products?category=TVs' },
      { label: 'Laptops & Computers', href: '/products?category=Laptops' },
      { label: 'Phones & Tablets', href: '/products?category=Phones' },
      { label: 'Audio & Headphones', href: '/products?category=Audio' },
      { label: 'New Arrivals', href: '/products?sort=newest' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/faq' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns', href: '/shipping#returns' },
      { label: 'Track Order', href: '/orders' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/about#press' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

const socialLinks: SocialLink[] = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:bg-sky-500 hover:text-white' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:bg-blue-600 hover:text-white' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white' },
];

const features = [
  { icon: Truck, label: 'Free Shipping', description: 'On orders over $50' },
  { icon: Shield, label: 'Secure Payment', description: '100% secure checkout' },
  { icon: CreditCard, label: 'Easy Returns', description: '30-day return policy' },
];

/**
 * Premium Footer with enhanced design
 */
export function Footer() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const handleSubscribe = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSuccess('');

      if (!email.trim()) {
        setError('Email is required');
        return;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      startTransition(async () => {
        try {
          const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          if (!response.ok) {
            setError(data.error || 'Something went wrong');
            return;
          }

          setSuccess(data.message);
          setEmail('');
          setError('');
        } catch {
          setError('Something went wrong');
        }
      });
    },
    [email, validateEmail]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      if (error) setError('');
    },
    [error]
  );

  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t border-border/50 bg-gradient-to-b from-background to-muted/30' role='contentinfo'>
      {/* Features Banner */}
      <div className='border-b border-border/50'>
        <div className='container-wide py-8'>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className='flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/30'
              >
                <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center'>
                  <feature.icon className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <p className='font-semibold text-foreground'>{feature.label}</p>
                  <p className='text-sm text-muted-foreground'>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className='container-wide py-16'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8'>
          {/* Brand Section */}
          <div className='lg:col-span-4 space-y-6'>
              <Link
                href='/'
                className='inline-flex items-center gap-3 group'
                aria-label='Electro home page'
              >
                <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-300'>
                  <Zap className='h-6 w-6 text-white' fill="currentColor" />
                </div>
                <div>
                  <span className='text-2xl font-black tracking-tight text-foreground leading-none block'>
                    Electro<span className="text-primary">.</span>
                  </span>
                  <p className='text-xs text-muted-foreground font-bold tracking-widest uppercase mt-1'>
                    Premium Store
                  </p>
                </div>
              </Link>

            <p className='text-muted-foreground max-w-sm leading-relaxed'>
              Your destination for cutting-edge electronics and premium gadgets. 
              Quality products, competitive prices, exceptional service.
            </p>

            {/* Contact Info */}
            <div className='space-y-3'>
              <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                <MapPin className='h-4 w-4 text-primary' />
                <span>123 Tech Street, Silicon Valley, CA 94000</span>
              </div>
              <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                <Phone className='h-4 w-4 text-primary' />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                <Mail className='h-4 w-4 text-primary' />
                <span>support@electro.store</span>
              </div>
            </div>

            {/* Social Links */}
            <div className='flex gap-2 pt-2'>
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={social.label}
                >
                  <Button
                    variant='ghost'
                    size='icon'
                    className={`rounded-xl transition-all duration-300 ${social.color}`}
                  >
                    <social.icon className='h-5 w-5' />
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <nav
            className='lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8'
            aria-label='Footer navigation'
          >
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className='font-semibold text-foreground mb-4'>
                  {section.title}
                </h3>
                <ul className='space-y-3'>
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className='group text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1'
                      >
                        <ArrowRight className='h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all' />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Newsletter Section */}
          <div className='lg:col-span-3'>
            <div className='bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/10'>
              <h3 className='font-semibold text-foreground mb-2'>
                Stay Updated
              </h3>
              <p className='text-sm text-muted-foreground mb-4'>
                Subscribe for exclusive deals, new arrivals, and tech tips.
              </p>

              <form onSubmit={handleSubscribe} className='space-y-3'>
                <div className='relative'>
                  <Input
                    type='email'
                    placeholder='Enter your email'
                    value={email}
                    onChange={handleEmailChange}
                    disabled={isPending}
                    className='h-12 pl-4 pr-12 rounded-xl bg-background'
                  />
                  <Button
                    type='submit'
                    size='icon'
                    disabled={isPending}
                    className='absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg'
                  >
                    {isPending ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Send className='h-4 w-4' />
                    )}
                  </Button>
                </div>
                {error && (
                  <p className='text-sm text-destructive'>{error}</p>
                )}
                {success && (
                  <p className='text-sm text-emerald-600 dark:text-emerald-400'>{success}</p>
                )}
              </form>

              <p className='text-xs text-muted-foreground mt-4'>
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className='border-t border-border/50 bg-muted/30'>
        <div className='container-wide py-6'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground'>
            <p>&copy; {currentYear} Electro Inc. All rights reserved.</p>
            <div className='flex flex-wrap justify-center gap-6'>
              <Link href='/privacy' className='hover:text-primary transition-colors'>
                Privacy Policy
              </Link>
              <Link href='/terms' className='hover:text-primary transition-colors'>
                Terms of Service
              </Link>
              <Link href='/cookies' className='hover:text-primary transition-colors'>
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
