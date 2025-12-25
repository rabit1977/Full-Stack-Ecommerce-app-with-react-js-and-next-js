'use client';

import { testimonialsData } from '@/lib/constants/testimonials';
import { AnimatePresence, motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonialsData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (testimonialsData.length === 0) {
    return null;
  }

  const activeTestimonial = testimonialsData[currentTestimonial];

  return (
    <div className='container mx-auto px-4 py-12 sm:py-16 lg:py-20'>
      <div className='max-w-3xl mx-auto text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='space-y-6'
        >
          <h3 className='text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white'>
            What Our Customers Say
          </h3>

          <div className='relative h-36 sm:h-28'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className='absolute inset-0 flex flex-col items-center justify-center gap-4'
              >
                {activeTestimonial.rating && (
                  <div className='flex gap-1'>
                    {Array.from({
                      length: activeTestimonial.rating,
                    }).map((_, i) => (
                      <Star
                        key={i}
                        className='h-5 w-5 fill-yellow-400 text-yellow-400'
                      />
                    ))}
                  </div>
                )}
                <p className='text-base sm:text-lg text-slate-600 dark:text-slate-300 italic max-w-2xl'>
                  "{activeTestimonial.quote}"
                </p>
                <p className='text-sm font-semibold text-slate-900 dark:text-slate-400'>
                  — {activeTestimonial.name}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className='flex justify-center gap-2 pt-4'>
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'bg-primary scale-125'
                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
