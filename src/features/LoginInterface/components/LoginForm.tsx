import React from 'react';
import { useLoginForm } from '../hooks/useLoginForm';

const LoginForm: React.FC = () => {
  const { handleSubmit, handleChange, values, errors } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={values.username}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md"
        />
        {errors.username && <span className="text-sm text-red-600">{errors.username}</span>}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md"
        />
        {errors.password && <span className="text-sm text-red-600">{errors.password}</span>}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
