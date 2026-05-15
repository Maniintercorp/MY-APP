import React from 'react';
import { ContactForm } from '../components/ContactForm';

export const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Contact Us</h1>
      <ContactForm />
    </div>
  );
};
