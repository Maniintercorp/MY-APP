import { useMutation } from '@tanstack/react-query';
import { signup, signin, socialAuth } from '../services';
import { SignupRequest, SigninRequest, SocialAuthRequest, AuthResponse, SigninResponse } from '../types';

export const useSignup = () => useMutation<AuthResponse, Error, SignupRequest>(signup);

export const useSignin = () => useMutation<SigninResponse, Error, SigninRequest>(signin);

export const useSocialAuth = () => useMutation<AuthResponse, Error, SocialAuthRequest>(socialAuth);
