// app/about/AboutContent.tsx
'use client';

import { aboutContent } from '@/lib/constants/about-data';
import { staggerContainer, staggerItem } from '@/lib/constants/animations';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const values = [
  {
    icon: <Zap className='h-8 w-8 text-primary' />,
    title: 'Innovation',
    description:
      'We constantly seek out the latest and greatest in technology to bring you products that shape the future.',
  },
  {
    icon: <ShieldCheck className='h-8 w-8 text-primary' />,
    title: 'Quality',
    description:
      'Our products are chosen for their reliability and performance, ensuring you get the best value for your money.',
  },
  {
    icon: <Heart className='h-8 w-8 text-red-500' />,
    title: 'Customer First',
    description:
      "Your satisfaction is our priority. We're here to help you every step of the way.",
  },
];

/**
 * Reusable value card component
 */
const ValueCard = ({ icon, title, description }: ValueCardProps) => (
  <div className='group p-6 sm:p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 dark:bg-slate-800 border border-transparent hover:border-primary/20'>
    <div className='w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
      {icon}
    </div>
    <h3 className='mt-6 text-xl font-semibold dark:text-white text-center'>
      {title}
    </h3>
    <p className='mt-3 leading-relaxed text-slate-600 dark:text-slate-400 text-center'>
      {description}
    </p>
  </div>
);

interface TeamMemberProps {
  member: {
    name: string;
    role: string;
    image: string;
  };
}

/**
 * Reusable team member card component
 */
const TeamMemberCard = ({ member }: TeamMemberProps) => (
  <div className='group text-center'>
    <div className='relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg dark:border-slate-800 group-hover:border-primary/50 transition-colors duration-300'>
      <Image
        src={member.image}
        alt={`${member.name} - ${member.role}`}
        fill
        sizes='128px'
        className='object-cover group-hover:scale-105 transition-transform duration-300'
      />
    </div>
    <h3 className='mt-4 text-lg font-semibold dark:text-white'>
      {member.name}
    </h3>
    <p className='text-slate-600 text-sm dark:text-slate-400 mt-1'>
      {member.role}
    </p>
  </div>
);

/**
 * Client Component with animations
 */
export const AboutContent = () => {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className='space-y-8'
    >
      {/* Story Section */}
      <motion.div variants={staggerItem}>
        <section
          className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'
          aria-labelledby='story-heading'
        >
          <div className='space-y-6'>
            <h1
              id='story-heading'
              className='text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white'
            >
              Our Story
            </h1>
            <div className='space-y-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400'>
              <p>
                Founded in 2023, Electro was born from a simple idea: to make
                the latest technology accessible to everyone. We&apos;re a team
                of tech enthusiasts who believe that innovation should be
                effortless and exciting. We&apos;ve dedicated ourselves to
                curating a selection of products that are not only
                high-performing but also beautifully designed.
              </p>
              <p>
                From the smallest smart gadget to the most powerful computing
                device, every product on our platform is hand-picked and
                rigorously tested. We stand behind our products with a
                commitment to quality and customer service that is second to
                none.
              </p>
            </div>
          </div>

          <div className='relative h-64 sm:h-80 lg:h-full lg:min-h-[400px] rounded-2xl overflow-hidden shadow-2xl'>
            <Image
              src={aboutContent.storyImage}
              alt='Electro office workspace with team collaboration'
              fill
              sizes='(max-width: 768px) 100vw, 50vw'
              className='object-cover hover:scale-105 transition-transform duration-500'
              priority
            />
          </div>
        </section>
      </motion.div>

      {/* Values Section */}
      <motion.div variants={staggerItem}>
        <section
          className='mt-16 sm:mt-20 lg:mt-24'
          aria-labelledby='values-heading'
        >
          <div className='text-center mb-12'>
            <h2
              id='values-heading'
              className='text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white'
            >
              Our Values
            </h2>
            <p className='mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto'>
              The principles that guide everything we do
            </p>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
            {values.map((value) => (
              <ValueCard
                key={value.title}
                icon={value.icon}
                title={value.title}
                description={value.description}
              />
            ))}
          </div>
        </section>
      </motion.div>

      {/* Team Section */}
      <motion.div variants={staggerItem}>
        <section
          className='mt-16 sm:mt-20 lg:mt-24'
          aria-labelledby='team-heading'
        >
          <div className='text-center mb-12'>
            <h2
              id='team-heading'
              className='text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white'
            >
              Meet Our Team
            </h2>
            <p className='mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto'>
              The passionate people behind Electro
            </p>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12'>
            {aboutContent.team.map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
        </section>
      </motion.div>
    </motion.div>
  );
};