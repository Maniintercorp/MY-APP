import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', type = 'text', ...props }, ref) => {
    return (
      <div className={`mb-4 ${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          ref={ref}
          type={type}
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-sm py-2 px-3 ${error ? 'border-red-500' : ''}`}
          {...props}
        />
        {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
export default Input;
