import React, { useState } from 'react';
import { useRegister } from '../hooks';
import { Button, Input } from '@/components/ui';

export const RegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registerMutation = useRegister();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerMutation.mutate({ username, email, password });
  };

  return (
    <div className="h-full flex items-center justify-center bg-black">
      <form onSubmit={handleSubmit} className="max-w-xs w-full">
        <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" className="mt-4 text-white" loading={registerMutation.isPending}>Register</Button>
      </form>
    </div>
  );
};