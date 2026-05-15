import axios from 'axios';
import { ContactFormRequest, ContactFormResponse } from '../types/contactFormTypes';

export const submitContactForm = async (
  formData: ContactFormRequest
): Promise<ContactFormResponse> => {
  const response = await axios.post<ContactFormResponse>('/api/contacts', formData);
  return response.data;
};
