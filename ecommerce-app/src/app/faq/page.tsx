'use client';

import React from 'react';

const FAQPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight dark:text-white">Frequently Asked Questions</h1>
      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold dark:text-white">What is your return policy?</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            We offer a 30-day return policy on all unopened products. Please visit our Shipping & Returns page for more details.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">How long does shipping take?</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">Do you ship internationally?</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Currently, we only ship within the United States.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
