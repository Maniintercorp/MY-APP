import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        ref={ref}
        {...props}
        className={`p-2 border w-full ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  )
);
Input.displayName = 'Input';
