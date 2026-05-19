import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useRegister } from '@/features/Auth/hooks';
import { RegisterDto } from '@/features/Auth/types';

export const RegisterPage = () => {
  const [form, setForm] = useState<RegisterDto>({ fullName: '', email: '', password: '', confirmPassword: '' });
  const { mutate, isPending, isError } = useRegister();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(form);
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-200'>
        <h1 className='text-2xl font-bold text-gray-900'>Create account</h1>
        <p className='mt-2 text-sm text-gray-600'>Start managing your inventory workspace.</p>
        <form className='mt-6 space-y-4' onSubmit={handleSubmit}>
          <Input label='Full name' name='fullName' value={form.fullName} onChange={handleChange} required />
          <Input label='Email' name='email' type='email' value={form.email} onChange={handleChange} required />
          <Input label='Password' name='password' type='password' value={form.password} onChange={handleChange} required />
          <Input label='Confirm password' name='confirmPassword' type='password' value={form.confirmPassword} onChange={handleChange} required />
          {isError ? <p className='text-sm text-red-600'>Unable to create account. Please try again.</p> : null}
          <Button type='submit' className='w-full' loading={isPending}>Create account</Button>
        </form>
        <p className='mt-6 text-center text-sm text-gray-600'>
          Already have an account? <Link to='/login' className='font-medium text-indigo-600 hover:text-indigo-700'>Sign in</Link>
        </p>
      </div>
    </div>
  );
};
export default RegisterPage;
