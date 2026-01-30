'use client';

import { testimonialsData } from '@/lib/constants/testimonials';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonialsData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  if (testimonialsData.length === 0) return null;

  const activeTestimonial = testimonialsData[currentTestimonial];

  return (
    <section className='relative py-12 sm:py-16 bg-background border-t border-b border-border/50'>
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none' />

      <div className='container mx-auto px-4 relative z-10'>
        <div className='max-w-3xl mx-auto'>
          <div className='flex flex-col items-center text-center space-y-6'>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className='h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary'
            >
              <Quote className='h-5 w-5 sm:h-6 sm:w-6 fill-current' />
            </motion.div>

            <AnimatePresence mode='wait'>
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className='space-y-6'
              >
                <h3 className='text-xl sm:text-2xl md:text-3xl font-medium leading-relaxed text-foreground'>
                  &ldquo;{activeTestimonial.quote}&rdquo;
                </h3>

                <div className='flex flex-col items-center gap-3'>
                  <Avatar className='h-12 w-12 sm:h-14 sm:w-14 border-2 border-primary/20'>
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeTestimonial.name}`} />
                    <AvatarFallback>{activeTestimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className='space-y-0.5'>
                    <p className='text-base sm:text-lg font-semibold text-foreground'>{activeTestimonial.name}</p>
                    <div className='flex items-center justify-center gap-0.5'>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < (activeTestimonial.rating || 5)
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-muted text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className='flex justify-center gap-2 pt-4'>
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className='group relative h-1.5 outline-none'
                  aria-label={`Go to testimonial ${index + 1}`}
                >
                  <span className={`block h-full rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'w-6 bg-primary' 
                      : 'w-1.5 bg-primary/20 group-hover:bg-primary/40'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
