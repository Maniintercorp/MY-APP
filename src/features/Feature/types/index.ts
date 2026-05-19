export interface FeatureItem {
  id: string;
  name: string;
  status: 'Active' | 'Draft' | 'Archived';
  owner: string;
}

export interface CreateFeatureItemDto {
  name: string;
  owner: string;
}
