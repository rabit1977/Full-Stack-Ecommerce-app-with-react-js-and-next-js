'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Send, Twitter, Zap } from 'lucide-react';
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
}

// Data for footer links
const footerLinks: FooterSection[] = [
  {
    title: 'Shop',
    links: [
      { label: 'TVs & Displays', href: '/products?category=TVs' },
      { label: 'Laptops & Computers', href: '/products?category=Laptops' },
      { label: 'Phones & Tablets', href: '/products?category=Phones' },
      { label: 'Audio', href: '/products?category=Audio' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Shipping & Returns', href: '/shipping' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

const socialLinks: SocialLink[] = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Follow us on Twitter' },
  {
    icon: Facebook,
    href: 'https://facebook.com',
    label: 'Follow us on Facebook',
  },
  {
    icon: Instagram,
    href: 'https://instagram.com',
    label: 'Follow us on Instagram',
  },
];

/**
 * Footer component with newsletter subscription and navigation links
 *
 * Features:
 * - Responsive grid layout
 * - Newsletter subscription with validation
 * - Social media links
 * - Organized navigation sections
 * - Accessible markup
 */
export function Footer() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  /**
   * Validate email format
   */
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  /**
   * Handle newsletter subscription
   */
  const handleSubscribe = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!email.trim()) {
        setError('Email is required');
        return;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      startTransition(() => {
        // Simulate API call
        setTimeout(() => {
          console.log('Newsletter subscription:', email);
          setEmail('');
          setError('');
          // You can add toast notification here
        }, 500);
      });
    },
    [email, validateEmail]
  );

  /**
   * Handle email input change
   */
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      if (error) {
        setError('');
      }
    },
    [error]
  );

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className='border-t dark:bg-slate-950/20 bg-white'
      role='contentinfo'
    >
      <div className='container mx-auto px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8'>
          {/* Brand Section */}
          <div className='lg:col-span-4 space-y-6'>
            <Link
              href='/'
              className='inline-flex items-center gap-2 group'
              aria-label='Electro home page'
            >
              <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <Zap className='h-6 w-6 text-primary' />
              </div>
              <span className='text-xl font-bold text-foreground'>Electro</span>
            </Link>

            <p className='text-sm text-muted-foreground max-w-xs'>
              Your one-stop shop for the best electronics. Quality products,
              unbeatable prices, exceptional service.
            </p>

            {/* Social Links */}
            <div className='flex gap-2'>
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
                    className='hover:bg-primary/10'
                  >
                    <social.icon className='h-5 w-5 text-muted-foreground hover:text-foreground transition-colors' />
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <nav
            className='lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-8'
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
                        className='text-sm text-muted-foreground hover:text-foreground transition-colors inline-block'
                      >
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
            <h3 className='font-semibold text-foreground mb-4'>
              Stay Connected
            </h3>
            <p className='text-sm text-muted-foreground mb-4'>
              Subscribe to our newsletter for the latest deals and updates.
            </p>

            <form onSubmit={handleSubscribe} className='space-y-3'>
              <div className='space-y-2'>
                <div className='flex gap-2'>
                  <Input
                    type='email'
                    placeholder='Enter your email'
                    value={email}
                    onChange={handleEmailChange}
                    disabled={isPending}
                    aria-label='Email for newsletter'
                    aria-invalid={!!error}
                    aria-describedby={error ? 'email-error' : undefined}
                    className={
                      error ? 'border-red-500 focus-visible:ring-red-500' : ''
                    }
                  />
                  <Button
                    type='submit'
                    disabled={isPending}
                    className='gap-2 flex-shrink-0'
                  >
                    {isPending ? (
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                    ) : (
                      <Send className='h-4 w-4' />
                    )}
                    <span className='hidden sm:inline'>Subscribe</span>
                  </Button>
                </div>
                {error && (
                  <p id='email-error' className='text-sm text-red-500'>
                    {error}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className='border-t bg-muted/30'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground'>
            <p>&copy; {currentYear} Electro Inc. All rights reserved.</p>
            <div className='flex gap-6'>
              <Link
                href='/privacy'
                className='hover:text-foreground transition-colors'
              >
                Privacy Policy
              </Link>
              <Link
                href='/terms'
                className='hover:text-foreground transition-colors'
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
