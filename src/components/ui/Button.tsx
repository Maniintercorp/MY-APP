import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, variant = 'primary', size = 'md', children }, ref) => {
    const baseStyles = 'rounded-full focus:outline-none transition';
    const variantStyles = variant === 'primary'
      ? 'bg-teal-600 text-white hover:bg-teal-700'
      : variant === 'secondary'
      ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
      : variant === 'danger'
      ? 'bg-red-500 text-white hover:bg-red-600'
      : 'bg-transparent text-teal-600 hover:bg-teal-50';
    const sizeStyles = size === 'sm'
      ? 'px-3 py-1 text-sm'
      : size === 'lg'
      ? 'px-5 py-3 text-lg'
      : 'px-4 py-2';

    return (
      <button
        ref={ref}
        onClick={onClick}
        className={` ${baseStyles} ${variantStyles} ${sizeStyles}`}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
