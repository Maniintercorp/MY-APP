import api from '@/lib/api';
import { LanguagesResponse } from '../types';

export async function fetchLanguages() {
  const { data } = await api.get<LanguagesResponse>('/api/languages');
  return data;
}
