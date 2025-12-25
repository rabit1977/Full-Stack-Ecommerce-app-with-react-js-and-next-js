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
import { staggerContainer, staggerItem } from '@/lib/constants/animations';
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
    title: '24/7 Customer Support',
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className='container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-6xl'
    >
      {/* Header Section */}
      <motion.section variants={staggerItem} className='text-center mb-12'>
        <h1 className='text-4xl font-bold text-foreground mb-4'>
          Our Services
        </h1>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          At Electro, we are committed to providing an exceptional shopping
          experience. Discover the range of services designed to make your life
          easier.
        </p>
      </motion.section>

      {/* Services Grid */}
      <motion.section
        variants={staggerItem}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            variants={staggerItem}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className='group h-full p-6 sm:p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 dark:bg-slate-800 border border-transparent hover:border-primary/20'>
              <CardHeader className='flex flex-col items-center mb-4'>
                <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                  <service.icon className='h-10 w-10 text-primary' />
                </div>
              </CardHeader>

              <CardTitle className='text-lg font-semibold text-foreground text-center mb-2'>
                {service.title}
              </CardTitle>
              <CardDescription className='text-sm text-muted-foreground text-center'>
                {service.description}
              </CardDescription>
              <CardContent></CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* Contact Section */}
      <motion.section variants={staggerItem} className='text-center'>
        <h2 className='text-2xl font-bold text-foreground mb-4'>
          Need Assistance?
        </h2>
        <p className='text-lg text-muted-foreground mb-6'>
          Our customer support team is here to help you with any questions or
          concerns.
        </p>
        <Link href='/contact'>
          <Button variant='default' size='lg'>
            Contact Support
          </Button>
        </Link>
      </motion.section>
    </motion.div>
  );
};