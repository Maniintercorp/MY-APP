import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { queryClient } from '@/lib/queryClient';

export function useApiQuery<TQueryFnData, TError = AxiosError, TData = TQueryFnData, TQueryKey extends unknown[] = unknown[]>(opts: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryClient'>) {
  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...opts,
  });
}

export function useApiMutation<TData = unknown, TError = AxiosError, TVariables = void, TContext = unknown>(opts: UseMutationOptions<TData, TError, TVariables, TContext>) {
  return useMutation<TData, TError, TVariables, TContext>(opts);
}
