// app/contact/ContactContent.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useState, useTransition } from 'react';
import { toast } from 'sonner';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const INITIAL_FORM_STATE: FormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export const ContactContent = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();

  /**
   * Validate form fields
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Handle input changes
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error for this field when user starts typing
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      startTransition(() => {
        // Simulate API call
        setTimeout(() => {
          console.log('Form submitted:', formData);
          toast("Message sent! We'll be in touch soon.");
          setFormData(INITIAL_FORM_STATE);
          setErrors({});
        }, 1000);
      });
    },
    [formData, validateForm]
  );

  return (
      <motion.div
        initial='hidden'
        animate='visible'
        className='container mx-auto px-4 py-12 sm:py-20 lg:py-28 max-w-7xl'
      >
        {/* Page Header */}
        <motion.div 
          className='text-center mb-16 sm:mb-24 space-y-4'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className='text-4xl sm:text-6xl font-black tracking-tighter text-foreground'>
            Get in Touch
          </h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            We&apos;re here to help. Reach out to us for any questions or support.
          </p>
        </motion.div>

        <div className='grid lg:grid-cols-12 gap-8 lg:gap-16 items-start'>
          {/* Contact Form */}
          <motion.div 
            className='lg:col-span-7 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Glossy overlay effect */}
            <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none' />

            <div className='relative z-10'>
              <h2 className='text-3xl font-bold mb-8'>
                Send us a message
              </h2>

              <form onSubmit={handleSubmit} className='space-y-6' noValidate>
                <div className='grid sm:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='name' className='font-semibold'>Name</Label>
                    <Input
                      id='name'
                      name='name'
                      placeholder='John Doe'
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isPending}
                      className={`h-12 bg-secondary/20 border-border/50 focus:border-primary/50 transition-all ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email' className='font-semibold'>Email</Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      placeholder='john@example.com'
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isPending}
                      className={`h-12 bg-secondary/20 border-border/50 focus:border-primary/50 transition-all ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className='text-sm text-red-500'>{errors.email}</p>}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='subject' className='font-semibold'>Subject</Label>
                  <Input
                    id='subject'
                    name='subject'
                    placeholder='How can we help?'
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isPending}
                    className={`h-12 bg-secondary/20 border-border/50 focus:border-primary/50 transition-all ${errors.subject ? 'border-red-500' : ''}`}
                  />
                   {errors.subject && <p className='text-sm text-red-500'>{errors.subject}</p>}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='message' className='font-semibold'>Message</Label>
                  <Textarea
                    id='message'
                    name='message'
                    placeholder='Tell us more about your inquiry...'
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isPending}
                    rows={6}
                    className={`bg-secondary/20 border-border/50 focus:border-primary/50 transition-all resize-none ${errors.message ? 'border-red-500' : ''}`}
                  />
                  {errors.message && <p className='text-sm text-red-500'>{errors.message}</p>}
                </div>

                <Button
                  type='submit'
                  className='w-full sm:w-auto h-14 px-10 text-lg font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95'
                  disabled={isPending}
                >
                  {isPending ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message <Send className='ml-2 h-5 w-5' />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div 
            className='lg:col-span-5 space-y-8'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Info Cards */}
            <div className='grid gap-6'>
              {[
                { icon: MapPin, title: 'Visit Us', content: '123 Tech Avenue, Suite 100\nInnovation City, CA 90210' },
                { icon: Phone, title: 'Call Us', content: '+1 (555) 123-4567', link: 'tel:+15551234567' },
                { icon: Mail, title: 'Email Us', content: 'support@electro.com', link: 'mailto:support@electro.com' },
                { icon: Clock, title: 'Business Hours', content: 'Mon-Fri: 9AM - 6PM\nSat: 10AM - 4PM' }
              ].map((item, idx) => (
                <div key={idx} className='flex items-start gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors shadow-sm'>
                  <div className='h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary'>
                    <item.icon className='h-6 w-6' />
                  </div>
                  <div>
                    <h3 className='font-bold text-lg mb-1'>{item.title}</h3>
                    {item.link ? (
                      <Link href={item.link} className='text-muted-foreground hover:text-primary transition-colors whitespace-pre-line'>
                        {item.content}
                      </Link>
                    ) : (
                      <p className='text-muted-foreground whitespace-pre-line'>{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className='rounded-3xl overflow-hidden shadow-xl border border-border/50 h-64 sm:h-80'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.004258724266!3d40.74076987932881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c8eef01%3A0x7a2ff2c2e2b3c3b!2sTech%20Avenue!5e0!3m2!1sen!2sus!4v1690835000000!5m2!1sen!2sus'
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title='Office location map'
                className='w-full h-full border-0 filter grayscale hover:grayscale-0 transition-all duration-700'
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
  );
};
