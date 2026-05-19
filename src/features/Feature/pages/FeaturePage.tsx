import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, Modal, Table, TableColumn } from '@/components/ui';
import { FeatureForm } from '@/features/Feature/components/FeatureForm';
import { useFeatureItems } from '@/features/Feature/hooks';
import { FeatureItem } from '@/features/Feature/types';

const fallbackItems: FeatureItem[] = [
  { id: '1', name: 'Customer Portal', status: 'Active', owner: 'Product' },
  { id: '2', name: 'Billing Automation', status: 'Draft', owner: 'Finance' },
];

export const FeaturePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isPending, isError } = useFeatureItems();
  const items = data ?? fallbackItems;

  const columns: TableColumn<FeatureItem>[] = [
    { key: 'name', header: 'Name' },
    { key: 'owner', header: 'Owner' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">{row.status}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feature</h1>
          <p className="mt-1 text-sm text-gray-600">Manage sample feature records.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} className="mr-2" /> Add item
        </Button>
      </div>
      {isPending ? <div className="rounded-xl border bg-white p-6 text-sm text-gray-600">Loader2 records...</div> : null}
      {isError ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Showing sample data because the API is unavailable.</div> : null}
      <Table columns={columns} data={items} getRowKey={(row) => row.id} />
      <Modal open={modalOpen} title="Create feature item" onClose={() => setModalOpen(false)}>
        <FeatureForm onCreated={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
};
export default FeaturePage;
