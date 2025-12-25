// src/constants/about-data.ts

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

interface AboutContent {
  storyImage: string;
  team: TeamMember[];
}

export const aboutContent: AboutContent = {
  storyImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
  team: [
    { name: 'Sarah Johnson', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' },
    { name: 'Michael Chen', role: 'Head of Technology', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop' },
    { name: 'Emily Rodriguez', role: 'Product Curator', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop' },
    { name: 'David Kim', role: 'Customer Experience', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
  ]
};