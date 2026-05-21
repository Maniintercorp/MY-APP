import { useQuery } from '@tanstack/react-query';
import { fetchLanguages } from '../services';
import { LanguagesResponse } from '../types';

export function useLanguages() {
  return useQuery<LanguagesResponse>({
    queryKey: ['languages'],
    queryFn: fetchLanguages,
    staleTime: 60 * 60 * 1000,
  });
}
