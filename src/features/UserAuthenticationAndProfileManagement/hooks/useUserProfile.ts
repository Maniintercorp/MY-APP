import { useQuery } from '@tanstack/react-query';
import { AuthService } from '../services/AuthService';

export const useUserProfile = () => {
  return useQuery(['userProfile'], AuthService.fetchUserProfile);
};