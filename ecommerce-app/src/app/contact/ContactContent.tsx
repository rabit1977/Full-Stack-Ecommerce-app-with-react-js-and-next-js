// app/contact/ContactContent.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUI } from '@/lib/hooks/useUI';
import { staggerContainer, staggerItem } from '@/lib/constants/animations';
import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useState, useTransition } from 'react';

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
  const { showToast } = useUI();
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
          showToast("Message sent! We'll be in touch soon.");
          setFormData(INITIAL_FORM_STATE);
          setErrors({});
        }, 1000);
      });
    },
    [formData, validateForm, showToast]
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className='container mx-auto px-4 py-12 sm:py-16 lg:py-20 space-y-6 lg:space-y-8 max-w-6xl'
    >
      {/* Page Header */}
      <motion.div variants={staggerItem} className='text-center mb-12 sm:mb-16'>
        <h1 className='text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white'>
          Get in Touch
        </h1>
        <p className='mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto'>
          We&apos;re here to help you. Fill out the form below or find us at our
          office.
        </p>
      </motion.div>

      <motion.div variants={staggerItem} className='grid md:grid-cols-2 gap-8 lg:gap-12'>
        {/* Contact Form */}
        <div className='rounded-xl border bg-white p-6 sm:p-8 shadow-lg dark:bg-slate-900 space-y-6 dark:border-slate-800'>
          <h2 className='text-2xl font-semibold dark:text-white mb-6'>
            Send us a message
          </h2>

          <form onSubmit={handleSubmit} className='space-y-8' noValidate>
            {/* Name Field */}
            <div className='space-y-2'>
              <Label htmlFor='name'>
                Name <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='name'
                name='name'
                placeholder='John Doe'
                value={formData.name}
                onChange={handleChange}
                disabled={isPending}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={
                  errors.name
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }
              />
              {errors.name && (
                <p id='name-error' className='text-sm text-red-500'>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className='space-y-2'>
              <Label htmlFor='email'>
                Email <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='john@example.com'
                value={formData.email}
                onChange={handleChange}
                disabled={isPending}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={
                  errors.email
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }
              />
              {errors.email && (
                <p id='email-error' className='text-sm text-red-500'>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Subject Field */}
            <div className='space-y-2'>
              <Label htmlFor='subject'>
                Subject <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='subject'
                name='subject'
                placeholder='How can we help?'
                value={formData.subject}
                onChange={handleChange}
                disabled={isPending}
                aria-invalid={!!errors.subject}
                aria-describedby={
                  errors.subject ? 'subject-error' : undefined
                }
                className={
                  errors.subject
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }
              />
              {errors.subject && (
                <p id='subject-error' className='text-sm text-red-500'>
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div className='space-y-2'>
              <Label htmlFor='message'>
                Message <span className='text-red-500'>*</span>
              </Label>
              <Textarea
                id='message'
                name='message'
                placeholder='Tell us more about your inquiry...'
                value={formData.message}
                onChange={handleChange}
                disabled={isPending}
                rows={5}
                aria-invalid={!!errors.message}
                aria-describedby={
                  errors.message ? 'message-error' : undefined
                }
                className={
                  errors.message
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }
              />
              {errors.message && (
                <p id='message-error' className='text-sm text-red-500'>
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type='submit'
              className='w-full gap-2'
              size='lg'
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                  Sending...
                </>
              ) : (
                <>
                  <Send className='h-4 w-4' />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Contact Information */}
        <div className='space-y-6 lg:space-y-8'>
          {/* Location Card */}
          <div className='rounded-xl border bg-white p-6 shadow-lg dark:bg-slate-900 dark:border-slate-800'>
            <h2 className='text-2xl font-semibold dark:text-white mb-6'>
              Our Location
            </h2>
            <div className='space-y-4'>
              <div className='flex gap-4'>
                <div className='flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                  <MapPin className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <p className='font-semibold dark:text-white'>Address</p>
                  <p className='text-slate-600 text-sm dark:text-slate-400 mt-1'>
                    123 Tech Avenue, Suite 100
                    <br />
                    Innovation City, CA 90210
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                  <Phone className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <p className='font-semibold dark:text-white'>Phone</p>
                  <Link
                    href='tel:+15551234567'
                    className='text-slate-600 text-sm dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors mt-1 block'
                  >
                    +1 (555) 123-4567
                  </Link>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                  <Mail className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <p className='font-semibold dark:text-white'>Email</p>
                  <Link
                    href='mailto:support@electro.com'
                    className='text-slate-600 text-sm dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors mt-1 block'
                  >
                    support@electro.com
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours Card */}
          <div className='rounded-xl border bg-white p-6 shadow-lg dark:bg-slate-900 dark:border-slate-800'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                <Clock className='h-5 w-5 text-primary' />
              </div>
              <h2 className='text-2xl font-semibold dark:text-white'>
                Business Hours
              </h2>
            </div>
            <div className='space-y-2 text-slate-600 dark:text-slate-400'>
              <div className='flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700'>
                <span className='font-medium text-sm'>Monday - Friday</span>
                <span className='text-sm'>9:00 AM - 6:00 PM</span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700'>
                <span className='font-medium text-sm'>Saturday</span>
                <span className='text-sm'>10:00 AM - 4:00 PM</span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='font-medium text-sm'>Sunday</span>
                <span className='font-medium text-sm'>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Map */}
      <motion.div
        variants={staggerItem}
        className='rounded-xl block w-full overflow-hidden shadow-lg h-64 sm:h-80'
      >
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.004258724266!3d40.74076987932881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c8eef01%3A0x7a2ff2c2e2b3c3b!2sTech%20Avenue!5e0!3m2!1sen!2sus!4v1690835000000!5m2!1sen!2sus'
          allowFullScreen
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
          title='Office location map'
          className='w-full h-full border-0'
        />
      </motion.div>
    </motion.div>
  );
};