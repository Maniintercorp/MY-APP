import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { queryClient } from '@/lib/queryClient';

export function useGet<Data>(key: string, url: string) {
  return useQuery<Data>({
    queryKey: [key],
    queryFn: () => api.get(url).then((r) => r.data),
  });
}

export function usePost<Data, Variables>(key: string, url: string) {
  return useMutation<Data, unknown, Variables>({
    mutationFn: (variables: Variables) => api.post(url, variables).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });
}