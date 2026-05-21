import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

// This hook is intentionally decoupled from the main i18n context
// so we can post the selected language with login request
export interface LoginDto {
  username: string;
  password: string;
  language: string;
}

interface User {
  id: string;
  username: string;
  preferredLanguage: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export function useLoginMutation() {
  return useMutation<LoginResponse, unknown, LoginDto>({
    mutationFn: async (dto) => {
      const { data } = await api.post<LoginResponse>('/api/auth/login', dto);
      // On success, could save user/token, etc.
      return data;
    },
    // Could add side effects (e.g. save token), but left out for demo
  });
}
