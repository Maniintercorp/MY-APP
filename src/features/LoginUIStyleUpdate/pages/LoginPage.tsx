import React from 'react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 to-white flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md">
        <LoginForm />
        <footer className="mt-6 text-center text-xs text-gray-400 select-none">
          &copy; {new Date().getFullYear()} MyApp. All rights reserved.
        </footer>
      </div>
    </div>
  );
};
export default LoginPage;
