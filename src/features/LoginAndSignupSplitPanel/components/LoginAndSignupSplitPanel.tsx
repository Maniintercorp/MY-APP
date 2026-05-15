import React from 'react';
import { Input, Button } from '@/components/ui';
import {
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';

export const LoginAndSignupSplitPanel: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <div className="bg-primary w-2/5 flex flex-col justify-center items-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Diprella</h1>
          <p className="mt-2 text-xl">Welcome Back!</p>
          <Button variant="ghost" className="mt-4 border-white border rounded-full px-6 py-2">
            SIGN IN
          </Button>
        </div>
      </div>
      <div className="w-3/5 flex flex-col justify-center p-8">
        <h2 className="text-teal font-bold text-3xl mb-8">Create Account</h2>
        <div className="flex space-x-4 mb-4">
          <button className="p-2 bg-gray-100 rounded-full"><Facebook size={24} /></button>
          <button className="p-2 bg-gray-100 rounded-full"><Twitter size={24} /></button>
          <button className="p-2 bg-gray-100 rounded-full"><Linkedin size={24} /></button>
        </div>
        <p className="text-center mb-4">or use your email for registration</p>
        <form>
          <Input label="Name" placeholder="Enter your name" className="mb-4" />
          <Input label="Email" placeholder="Enter your email" type="email" className="mb-4" />
          <Input label="Password" placeholder="Enter your password" type="password" className="mb-4" />
          <Button variant="primary" size="lg" className="bg-teal text-white mt-4">
            SIGN UP
          </Button>
        </form>
        <div className="absolute right-0 top-0">
          <div className="bg-yellow-300 h-16 w-16 rounded-full"></div>
        </div>
        <div className="absolute left-0 bottom-0">
          <div className="bg-red-300 h-16 w-16 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
