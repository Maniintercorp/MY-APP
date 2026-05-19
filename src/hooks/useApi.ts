import { useMutation, useQuery, UseMutationOptions, UseQueryOptions, QueryKey } from '@tanstack/react-query';

export const useApiQuery = <TData, TError = Error>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) => useQuery<TData, TError>({ queryKey, queryFn, ...options });

export const useApiMutation = <TData, TVariables, TError = Error>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) => useMutation<TData, TError, TVariables>({ mutationFn, ...options });
