import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import { ApiResponse, ApiError } from '@/types/common';

export const useFetchData = <T>(url: string) =>
  useQuery<T, AxiosError<ApiError>>({ queryKey: [url], queryFn: () => api.get<T>(url).then(res => res.data) });

export const usePostData = <T, R>(url: string, data: T) =>
  useMutation<R, AxiosError<ApiError>, T>({ mutationFn: () => api.post<T, ApiResponse<R>>(url, data).then(res => res.data) });
