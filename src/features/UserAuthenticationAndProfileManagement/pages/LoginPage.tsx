import React from 'react';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { LoginRequest } from '../types';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const mutation = useMutation((user: LoginRequest) => loginUser(user), {
    onSuccess: (data) => {
      login(data.token);
    }
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="border p-2 w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">Login</button>
      </form>
      <p className="text-center mt-4">
        <Link to="/register" className="text-blue-500">Don't have an account? Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
