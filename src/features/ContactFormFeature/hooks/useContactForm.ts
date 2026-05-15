import { useState } from 'react';
import { useMutation } from 'react-query';
import { ContactFormData } from '../types/contactForm.types';
import { submitContactForm } from '../services/contactFormService';

export const useContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({ name: '', email: '', message: '' });
  
  const mutation = useMutation(submitContactForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isSuccess: mutation.isSuccess,
  };
};
