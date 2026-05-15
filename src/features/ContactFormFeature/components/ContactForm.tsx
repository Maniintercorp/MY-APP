import React from 'react';
import { useContactForm } from '../hooks/useContactForm';

const ContactForm: React.FC = () => {
  const { formState, handleChange, handleSubmit, isSuccess } = useContactForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formState.name}
          onChange={handleChange}
          className="border rounded-md p-2 w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formState.email}
          onChange={handleChange}
          className="border rounded-md p-2 w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block">Message</label>
        <textarea
          id="message"
          name="message"
          value={formState.message}
          onChange={handleChange}
          className="border rounded-md p-2 w-full"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Submit</button>
      {isSuccess && <div className="text-green-500 mt-2">Your message has been sent successfully!</div>}
    </form>
  );
};

export default ContactForm;
