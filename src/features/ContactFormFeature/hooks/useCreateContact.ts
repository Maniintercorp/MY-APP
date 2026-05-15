import { useMutation } from '@tanstack/react-query';
import { ContactFormData } from '../types';
import { createContact } from '../services/contactService';

export const useCreateContact = () => {
  return useMutation((formData: ContactFormData) => createContact(formData));
};
