interface Testimonial {
  quote: string;
  name: string;
  rating?: number;
}

export const testimonialsData: Testimonial[] = [
  {
    quote:
      "The Quantum TV has the best picture I've ever seen. Absolutely stunning quality!",
    name: 'Sarah J.',
    rating: 5,
  },
  {
    quote:
      'My new AeroBook is unbelievably fast and light. Perfect for my daily work.',
    name: 'Mike R.',
    rating: 5,
  },
  {
    quote:
      'Fast shipping and excellent User service! Highly recommend this store.',
    name: 'Emily W.',
    rating: 5,
  },
];
