import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-gray-100 text-gray-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-indigo-200 opacity-40 blur-3xl" />
        <div className="absolute -right-24 bottom-8 h-80 w-80 rounded-full bg-gray-300 opacity-40 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-indigo-100 opacity-60 blur-2xl" />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <section className="hidden lg:block" aria-label="Authentication benefits">
            <div className="rounded-3xl border border-white bg-white/60 p-8 shadow-2xl shadow-indigo-100 backdrop-blur">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-100">
                <ShieldCheck size={18} aria-hidden="true" />
                Secure SaaS workspace
              </div>

              <div className="mt-10 rounded-3xl bg-gray-900 p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-indigo-200">Welcome back</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight">Sign in to manage your workspace.</h1>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-900/30">
                    <ShieldCheck size={28} aria-hidden="true" />
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                    <div className="h-2 w-28 rounded-full bg-indigo-300" />
                    <div className="mt-4 h-2 w-full rounded-full bg-white/20" />
                    <div className="mt-3 h-2 w-4/5 rounded-full bg-white/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                      <div className="text-2xl font-bold">99.9%</div>
                      <div className="mt-1 text-sm text-gray-300">Uptime</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                      <div className="text-2xl font-bold">24/7</div>
                      <div className="mt-1 text-sm text-gray-300">Access</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 text-green-600" size={18} aria-hidden="true" />
                  <span>Protected authentication with persistent sessions when Remember me is selected.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 text-green-600" size={18} aria-hidden="true" />
                  <span>Responsive layout optimized for desktop, tablet, and mobile screens.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-md" aria-label="Sign in form">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
};
export default AuthLayout;
