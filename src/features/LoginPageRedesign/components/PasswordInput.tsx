import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { FormInput } from '@/features/LoginPageRedesign/components/FormInput';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, helperText, disabled, containerClassName = '', ...props }, ref) => {
    const [visible, setVisible] = useState<boolean>(false);

    const toggleVisibility = () => {
      setVisible((current) => !current);
    };

    return (
      <FormInput
        ref={ref}
        label={label}
        type={visible ? 'text' : 'password'}
        error={error}
        helperText={helperText}
        disabled={disabled}
        containerClassName={containerClassName}
        icon={<Lock size={18} />}
        rightElement={
          <button
            type="button"
            onClick={toggleVisibility}
            disabled={disabled}
            className="rounded-lg p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
