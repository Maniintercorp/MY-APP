import React, { useState } from 'react';
import { useRegisterUser } from '../hooks/useRegisterUser';

const UserRegistrationForm: React.FC = () => {
  const { mutate: registerUser, isLoading, error } = useRegisterUser();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    registerUser({ username, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <div className="mb-4">
        <label className="block mb-2">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border"
        />
      </div>
      <button type="submit" className="p-2 bg-blue-500 text-white" disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>
      {error && <div className="text-red-500 mt-2">Error: {error.message}</div>}
    </form>
  );
};

export default UserRegistrationForm;