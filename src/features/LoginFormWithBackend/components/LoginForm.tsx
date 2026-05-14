import React from 'react';
import { useForm } from '../hooks/useLoginForm';

export const LoginForm: React.FC = () => {
  const { form, errors, handleChange, handleSubmit } = useForm();

  return (
    <div className="max-w-md mx-auto my-10 p-5 border rounded shadow-sm">
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
        <div>
          <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700">Login</button>
        </div>
      </form>
    </div>
  );
};
