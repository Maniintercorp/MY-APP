import axios from 'axios';
import { ContactFormData, ContactFormResponse } from '../types/contactForm.types';

const API_ENDPOINT = '/api/contacts';

export const submitContactForm = async (data: ContactFormData): Promise<ContactFormResponse> => {
  const response = await axios.post(API_ENDPOINT, data);
  return response.data;
};
