import axios from 'axios';
import { ContactFormData, ContactResponse } from '../types';

const API_URL = '/api/contacts';

export const createContact = async (formData: ContactFormData) => {
  const response = await axios.post<ContactResponse>(API_URL, formData);
  return response.data;
};
