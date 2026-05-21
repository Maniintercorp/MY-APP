import React, { useState } from 'react';
import { Input, Button } from '@/components/ui';
import { useLogin } from '../hooks';
import { Mail, Eye } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate({ email, password, rememberMe });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-gray-200 relative overflow-hidden">
      <div className="absolute inset-0">
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-600 opacity-30 rounded-full" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400 opacity-20 rounded-full" />
        <div className="absolute top-10 transform rotate-45">
          {/* Birds or Sky Elements */}
        </div>
      </div>
      <nav className="bg-white shadow-md rounded-full px-6 py-3 flex justify-around absolute top-4 w-3/4 max-w-xl">
        <span className="font-bold">Home</span>
        <span className="font-bold">About</span>
        <span className="font-bold">Service</span>
        <span className="font-bold">Contact</span>
        <span className="font-bold">Login</span>
      </nav>
      <div className="bg-white bg-opacity-70 shadow-lg p-8 rounded-2xl max-w-md w-full">
        <h1 className="text-xl font-bold text-center mb-4">LOGIN</h1>
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} className="text-gray-400" />}
            required
          />
          <div className="relative">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Eye size={16} className="text-gray-400" />}
              required
            />
            <a href="#" className="absolute right-0 text-sm text-blue-600 hover:underline ml-4">Forgot Password?</a>
          </div>
          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600 rounded-md border-gray-300"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="ml-2 text-sm text-gray-600">Remember Me</span>
            </label>
            <a href="#" className="text-sm font-bold text-black hover:underline">Register</a>
          </div>
          <Button type="submit" className="w-full py-2 mt-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-xl transition duration-150 ease-in-out transform hover:scale-105">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
