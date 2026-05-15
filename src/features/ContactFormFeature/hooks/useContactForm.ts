import { useState } from 'react';
import { useMutation } from 'react-query';
import { submitContactForm } from '../services/contactFormService';
import { ContactFormRequest, ContactFormResponse } from '../types/contactFormTypes';

export const useContactForm = () => {
  const [formState, setFormState] = useState<ContactFormRequest>({
    name: '',
    email: '',
    message: '',
  });

  const mutation = useMutation<ContactFormResponse, Error, ContactFormRequest>(submitContactForm, {
    onSuccess: () => {
      // Handle side effects after a successful form submission
      setFormState({ name: '', email: '', message: '' });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formState);
  };

  return {
    formState,
    handleChange,
    handleSubmit,
    isSuccess: mutation.isSuccess,
  };
};
