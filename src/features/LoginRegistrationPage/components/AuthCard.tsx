import React from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthCard = ({ title, subtitle, children, footer }: AuthCardProps) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-gray-200/80 ring-1 ring-gray-200 sm:p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-lg shadow-indigo-600/25">
          A
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">{subtitle}</p>
      </div>

      {children}

      {footer ? <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-600">{footer}</div> : null}
    </div>
  );
};
export default AuthCard;
