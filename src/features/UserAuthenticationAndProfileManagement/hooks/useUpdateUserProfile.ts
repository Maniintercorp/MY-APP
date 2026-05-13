import { useMutation } from '@tanstack/react-query';
import { AuthService } from '../services/AuthService';

export const useUpdateUserProfile = () => {
  return useMutation((profileData: { userId: string, username: string; email: string; password?: string }) =>
    AuthService.updateProfile(profileData)
  );
};