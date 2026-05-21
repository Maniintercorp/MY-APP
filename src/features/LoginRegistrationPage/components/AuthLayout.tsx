import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const benefits = [
  'Secure JWT-based access for your workspace',
  'Fast onboarding with a clean user profile',
  'Responsive experience across desktop and mobile',
];

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-gray-900 px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-gray-900 to-gray-950" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-indigo-100 ring-1 ring-white/15">
            <ShieldCheck size={18} />
            Secure SaaS Authentication
          </div>
          <div className="mt-16 max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Welcome to a cleaner way to access your application.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Sign in or create your account with a polished, accessible authentication experience designed for modern teams.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-3 text-gray-200">
              <CheckCircle2 size={20} className="text-green-400" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl">{children}</div>
      </main>
    </div>
  );
};
export default AuthLayout;
