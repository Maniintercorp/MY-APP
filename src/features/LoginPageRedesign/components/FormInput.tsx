import React, { useId } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      rightElement,
      containerClassName = '',
      className = '',
      id,
      name,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || name || generatedId;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className={containerClassName}>
        <label htmlFor={inputId} className="block text-sm font-semibold text-gray-800">
          {label}
        </label>
        <div className="relative mt-2">
          {icon ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400" aria-hidden="true">
              {icon}
            </div>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            name={name}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={`block w-full rounded-2xl border bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${icon ? 'pl-10' : ''} ${rightElement ? 'pr-12' : ''} ${error ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'} ${className}`}
            {...props}
          />
          {rightElement ? <div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightElement}</div> : null}
        </div>
        {helperText ? (
          <p id={helperId} className="mt-2 text-sm text-gray-500">
            {helperText}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
export default FormInput;
