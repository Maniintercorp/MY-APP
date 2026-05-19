import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { useCreateFeatureItem } from '@/features/Feature/hooks';
import { CreateFeatureItemDto } from '@/features/Feature/types';

interface FeatureFormProps {
  onCreated: () => void;
}

export const FeatureForm = ({ onCreated }: FeatureFormProps) => {
  const [form, setForm] = useState<CreateFeatureItemDto>({ name: '', owner: '' });
  const { mutate, isPending } = useCreateFeatureItem();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(form, {
      onSuccess: () => {
        setForm({ name: '', owner: '' });
        onCreated();
      },
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
      <Input label="Owner" name="owner" value={form.owner} onChange={handleChange} required />
      <div className="flex justify-end">
        <Button type="submit" loading={isPending}>Create item</Button>
      </div>
    </form>
  );
};
export default FeatureForm;
