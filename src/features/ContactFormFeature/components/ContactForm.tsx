import React, { useState } from 'react';
import { useCreateContact } from '../hooks/useCreateContact';

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

const initialFormState: ContactFormData = {
  name: '',
  email: '',
  message: ''
};

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormState);
  const [errorMessage, setErrorMessage] = useState('');
  const { mutate: createContact, isSuccess, isError, error } = useCreateContact();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('All fields are required.');
      return;
    }
    setErrorMessage('');
    createContact(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium" htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 p-2 border w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 p-2 border w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium" htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="mt-1 p-2 border w-full"
          required
        />
      </div>
      {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Submit
      </button>
      {isSuccess && <div className="text-green-500 mt-2">Your message was sent successfully!</div>}
      {isError && <div className="text-red-500 mt-2">{error instanceof Error ? error.message : 'An error occurred.'}</div>}
    </form>
  );
};
