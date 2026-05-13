import React from 'react';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { RegisterRequest } from '../types';

const RegisterPage: React.FC = () => {
  const mutation = useMutation((newUser: RegisterRequest) => registerUser(newUser));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      username: formData.get('username') as string,
    };
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" placeholder="Email" required className="border p-2 w-full" />
        <input type="password" name="password" placeholder="Password" required className="border p-2 w-full" />
        <input type="text" name="username" placeholder="Username" required className="border p-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">Register</button>
      </form>
      <p className="text-center mt-4">
        <Link to="/login" className="text-blue-500">Already have an account? Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
