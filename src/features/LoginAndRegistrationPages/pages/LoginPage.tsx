import React, { useState } from 'react';
import { useLogin } from '../hooks';
import { Button, Input } from '@/components/ui';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="h-full flex items-center justify-center bg-green-100">
      <form onSubmit={handleSubmit} className="max-w-xs w-full">
        <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" className="mt-4" loading={loginMutation.isPending}>Login</Button>
      </form>
    </div>
  );
};