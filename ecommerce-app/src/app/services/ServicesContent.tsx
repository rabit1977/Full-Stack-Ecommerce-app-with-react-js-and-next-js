// app/services/ServicesContent.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { motion } from 'framer-motion';
import { Headset, LucideIcon, Package, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';

interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
}

const services: Service[] = [
  {
    title: 'Fast & Reliable Shipping',
    description:
      'Get your products delivered quickly and safely to your doorstep with our efficient shipping network.',
    icon: Truck,
  },
  {
    title: '24/7 User Support',
    description:
      'Our dedicated support team is always available to assist you with any queries or issues.',
    icon: Headset,
  },
  {
    title: 'Quality Assurance',
    description:
      'We ensure all our products meet the highest quality standards for your satisfaction.',
    icon: ShieldCheck,
  },
  {
    title: 'Easy Returns & Refunds',
    description:
      'Hassle-free returns and quick refunds if you are not completely satisfied with your purchase.',
    icon: Package,
  },
];

export const ServicesContent = () => {
  return (
    <div className='min-h-screen py-20 space-y-24'>
      {/* Header Section */}
      <motion.section 
        className='text-center space-y-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className='inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase mb-4'>
          Why Choose Us
        </span>
        <h1 className='text-4xl sm:text-6xl font-black tracking-tight text-foreground max-w-4xl mx-auto leading-tight'>
          Premium Services for <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">
            Exceptional Experiences
          </span>
        </h1>
        <p className='text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
          At Electro, we are committed to providing an exceptional shopping
          experience. Discover the range of services designed to make your life
          easier.
        </p>
      </motion.section>

      {/* Services Grid */}
      <motion.section 
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <Card className='group h-full p-8 bg-card rounded-[2rem] border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              
              <CardHeader className='flex flex-col items-center mb-6 relative z-10 p-0'>
                <div className='w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mb-6'>
                  <service.icon className='h-10 w-10 text-primary' />
                </div>
                <CardTitle className='text-xl font-bold text-foreground text-center'>
                  {service.title}
                </CardTitle>
              </CardHeader>

              <CardContent className='p-0 relative z-10'>
                <CardDescription className='text-base text-muted-foreground text-center leading-relaxed'>
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        className='relative rounded-3xl overflow-hidden bg-primary text-primary-foreground py-20 px-6 text-center'
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className='absolute inset-0 bg-[url("/patterns/grid.svg")] opacity-10' />
        <div className='absolute inset-0 bg-gradient-to-br from-black/20 to-transparent' />
        
        <div className='relative z-10 max-w-3xl mx-auto space-y-8'>
          <h2 className='text-3xl sm:text-4xl font-bold'>
            Need Personalized Assistance?
          </h2>
          <p className='text-xl text-primary-foreground/90 max-w-2xl mx-auto'>
            Our dedicated expert support team is here to help you with any questions or
            custom requirements you might have.
          </p>
          <Link href='/contact' className='inline-block'>
            <Button 
              variant='secondary' 
              size='lg' 
              className='h-14 px-10 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all'
            >
              Contact Support
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
};
