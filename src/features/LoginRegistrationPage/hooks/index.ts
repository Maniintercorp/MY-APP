import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, clearPersistedAuthToken, getStoredAuthToken, persistAuthToken } from '@/features/LoginRegistrationPage/services';
import type {
  ApiErrorResponse,
  AuthResponse,
  LoginRequest,
  LogoutResponse,
  RegisterRequest,
  UserDto,
} from '@/features/LoginRegistrationPage/types';

export const authQueryKeys = {
  me: ['auth', 'me'] as const,
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [authToken, setAuthToken] = useState<string | null>(() => getStoredAuthToken());

  const currentUserQuery = useQuery<UserDto, ApiErrorResponse>({
    queryKey: authQueryKeys.me,
    queryFn: () => authService.getCurrentUser(),
    enabled: Boolean(authToken),
    retry: false,
  });

  const applyAuthResponse = useCallback(
    (response: AuthResponse) => {
      persistAuthToken(response.accessToken);
      setAuthToken(response.accessToken);
      queryClient.setQueryData(authQueryKeys.me, response.user);
    },
    [queryClient]
  );

  const loginMutation = useMutation<AuthResponse, ApiErrorResponse, LoginRequest>({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: applyAuthResponse,
  });

  const registerMutation = useMutation<AuthResponse, ApiErrorResponse, RegisterRequest>({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
    onSuccess: applyAuthResponse,
  });

  const logoutMutation = useMutation<LogoutResponse, ApiErrorResponse, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearPersistedAuthToken();
      setAuthToken(null);
      queryClient.removeQueries({ queryKey: authQueryKeys.me });
    },
    onError: () => {
      clearPersistedAuthToken();
      setAuthToken(null);
      queryClient.removeQueries({ queryKey: authQueryKeys.me });
    },
  });

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const currentUser = currentUserQuery.data ?? null;
  const isAuthenticated = Boolean(authToken) && Boolean(currentUser ?? queryClient.getQueryData<UserDto>(authQueryKeys.me));

  return useMemo(
    () => ({
      login: loginMutation.mutateAsync,
      register: registerMutation.mutateAsync,
      logout,
      currentUser,
      authToken,
      isAuthenticated,
      isCheckingAuth: currentUserQuery.isPending && Boolean(authToken),
      loginError: loginMutation.error,
      registerError: registerMutation.error,
      logoutError: logoutMutation.error,
      isLoginPending: loginMutation.isPending,
      isRegisterPending: registerMutation.isPending,
      isLogoutPending: logoutMutation.isPending,
    }),
    [
      authToken,
      currentUser,
      currentUserQuery.isPending,
      isAuthenticated,
      loginMutation.error,
      loginMutation.isPending,
      loginMutation.mutateAsync,
      logout,
      logoutMutation.error,
      logoutMutation.isPending,
      registerMutation.error,
      registerMutation.isPending,
      registerMutation.mutateAsync,
    ]
  );
};
