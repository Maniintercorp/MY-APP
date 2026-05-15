import React from 'react';

<<<<<<< HEAD
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
=======
interface ButtonProps {
  onClick?: () => void;
>>>>>>> 31f24afbd74987b042d98fd9181b003d66ce1a4b
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
<<<<<<< HEAD
  ({ variant = 'primary', size = 'md', className = '', children, ...rest }, ref) => {
=======
  ({ onClick, variant = 'primary', size = 'md', children }, ref) => {
>>>>>>> 31f24afbd74987b042d98fd9181b003d66ce1a4b
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
<<<<<<< HEAD
        {...rest}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
=======
        onClick={onClick}
        className={` ${baseStyles} ${variantStyles} ${sizeStyles}`}
>>>>>>> 31f24afbd74987b042d98fd9181b003d66ce1a4b
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
