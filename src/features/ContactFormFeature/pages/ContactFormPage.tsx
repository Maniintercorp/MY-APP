import React from 'react';
import ContactForm from '../components/ContactForm';

const ContactFormPage: React.FC = () => (
  <div className="max-w-md mx-auto mt-10">
    <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
    <ContactForm />
  </div>
);

export default ContactFormPage;
