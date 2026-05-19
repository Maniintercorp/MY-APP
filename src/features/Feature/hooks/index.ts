import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFeatureItem, getFeatureItems } from '@/features/Feature/services';
import { CreateFeatureItemDto } from '@/features/Feature/types';

export const featureQueryKeys = {
  all: ['features'] as const,
};

export const useFeatureItems = () => useQuery({
  queryKey: featureQueryKeys.all,
  queryFn: getFeatureItems,
});

export const useCreateFeatureItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateFeatureItemDto) => createFeatureItem(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: featureQueryKeys.all }),
  });
};
