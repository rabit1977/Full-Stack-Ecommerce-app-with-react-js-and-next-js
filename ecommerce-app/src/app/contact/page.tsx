// app/contact/page.tsx
import { ContactContent } from './ContactContent';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ContactSkeleton } from './ContactSkeleton';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Electro. We\'re here to help with your questions, orders, and support needs.',
};

const ContactPage = () => {
  return (
    <Suspense fallback={<ContactSkeleton />}>
      <ContactContent />
    </Suspense>
  );
};

export default ContactPage;