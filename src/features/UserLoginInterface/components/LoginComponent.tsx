import React from 'react';
import { useLogin } from '../hooks/useLogin';
import { LoginForm } from '../types';

export const LoginComponent: React.FC = () => {
  const { mutate, isLoading, error, isSuccess, message } = useLogin();
  const [formData, setFormData] = React.useState<LoginForm>({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      alert('All fields are required.');
      return;
    }
    mutate(formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded p-5">
        <h2 className="text-lg font-semibold mb-4">Login</h2>
        <input
          className="mb-3 w-full p-2 border"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          className="mb-3 w-full p-2 border"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button className="w-full bg-blue-500 text-white py-2" type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {isSuccess && <p className="mt-4 text-green-500">{message}</p>}
        {error && <p className="mt-4 text-red-500">Error: {error}</p>}
      </form>
    </div>
  );
};
