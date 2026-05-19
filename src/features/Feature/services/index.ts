import { CreateFeatureItemDto, FeatureItem } from '@/features/Feature/types';

let featureItems: FeatureItem[] = [
  { id: '1', name: 'Customer Portal', status: 'Active', owner: 'Product' },
  { id: '2', name: 'Billing Automation', status: 'Draft', owner: 'Finance' },
];

export const getFeatureItems = async (): Promise<FeatureItem[]> => featureItems;

export const createFeatureItem = async (dto: CreateFeatureItemDto): Promise<FeatureItem> => {
  const item: FeatureItem = {
    id: crypto.randomUUID(),
    name: dto.name,
    owner: dto.owner,
    status: 'Draft',
  };
  featureItems = [item, ...featureItems];
  return item;
};
