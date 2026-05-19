import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useLogin } from '@/features/Auth/hooks';
import { LoginDto } from '@/features/Auth/types';

export const LoginPage = () => {
  const [form, setForm] = useState<LoginDto>({ email: '', password: '' });
  const { mutate, isPending, isError } = useLogin();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(form);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-600">Sign in to continue to your workspace.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
          {isError ? <p className="text-sm text-red-600">Unable to sign in. Please check your credentials.</p> : null}
          <Button type="submit" className="w-full" loading={isPending}>Sign in</Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Need an account? <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-700">Create one</Link>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;
