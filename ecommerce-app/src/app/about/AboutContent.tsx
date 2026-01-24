// app/about/AboutContent.tsx
'use client';

import { aboutContent } from '@/lib/constants/about-data';

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
    icon: <Zap className='h-8 w-8 text-primary group-hover:text-white transition-colors duration-300' />,
    title: 'Innovation',
    description:
      'We constantly seek out the latest and greatest in technology to bring you products that shape the future.',
  },
  {
    icon: <ShieldCheck className='h-8 w-8 text-primary group-hover:text-white transition-colors duration-300' />,
    title: 'Quality',
    description:
      'Our products are chosen for their reliability and performance, ensuring you get the best value for your money.',
  },
  {
    icon: <Heart className='h-8 w-8 text-primary group-hover:text-white transition-colors duration-300' />,
    title: 'User First',
    description:
      "Your satisfaction is our priority. We're here to help you every step of the way.",
  },
];

/**
 * Reusable value card component
 */
const ValueCard = ({ icon, title, description }: ValueCardProps) => (
  <div className='group p-8 bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:bg-primary hover:border-primary transition-all duration-300'>
    <div className='w-16 h-16 rounded-2xl bg-primary/10 group-hover:bg-white/20 flex items-center justify-center mb-6 transition-colors duration-300'>
      {icon}
    </div>
    <h3 className='text-xl font-bold text-foreground group-hover:text-white mb-3'>
      {title}
    </h3>
    <p className='text-muted-foreground group-hover:text-white/90 leading-relaxed transition-colors duration-300'>
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
  <div className='group relative overflow-hidden rounded-2xl bg-card border border-border/50'>
    <div className='relative aspect-[3/4] w-full overflow-hidden'>
      <Image
        src={member.image}
        alt={`${member.name} - ${member.role}`}
        fill
        sizes='(max-width: 768px) 100vw, 33vw'
        className='object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale group-hover:grayscale-0'
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity' />
      
      <div className='absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300'>
        <h3 className='text-xl font-bold text-white'>
          {member.name}
        </h3>
        <p className='text-white/80 text-sm font-medium mt-1'>
          {member.role}
        </p>
      </div>
    </div>
  </div>
);

/**
 * Client Component with animations
 */
export const AboutContent = () => {
  return (
    <div className='space-y-20 sm:space-y-32'>
      {/* Story Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className='grid lg:grid-cols-2 gap-12 lg:gap-20 items-center'
        aria-labelledby='story-heading'
      >
        <div className='space-y-8'>
          <div className='space-y-2'>
            <span className='text-primary font-semibold tracking-wider uppercase text-sm'>Who We Are</span>
            <h1
              id='story-heading'
              className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight'
            >
              Building the Future of Tech Retail
            </h1>
          </div>
          <div className='space-y-6 text-lg leading-relaxed text-muted-foreground'>
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
              commitment to quality and User service that is second to none.
            </p>
          </div>
        </div>

        <div className='relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 border-8 border-background'>
          <Image
            src={aboutContent.storyImage}
            alt='Electro office workspace with team collaboration'
            fill
            sizes='(max-width: 768px) 100vw, 50vw'
            className='object-cover hover:scale-110 transition-transform duration-700'
            priority
          />
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        aria-labelledby='values-heading'
      >
        <div className='text-center mb-16 space-y-4'>
          <h2
            id='values-heading'
            className='text-3xl sm:text-4xl font-bold tracking-tight text-foreground'
          >
            Our Core Values
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            The principles that guide every decision we make
          </p>
        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {values.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <ValueCard
                icon={value.icon}
                title={value.title}
                description={value.description}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        aria-labelledby='team-heading'
      >
        <div className='text-center mb-16 space-y-4'>
          <h2
            id='team-heading'
            className='text-3xl sm:text-4xl font-bold tracking-tight text-foreground'
          >
            Meet The Minds
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            The passionate team driving innovation at Electro
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
          {aboutContent.team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <TeamMemberCard member={member} />
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};
