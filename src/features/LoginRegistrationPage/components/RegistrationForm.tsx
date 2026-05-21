import React, { useState } from 'react';
import { AlertCircle, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import type { RegistrationFormValues } from '@/features/LoginRegistrationPage/types';

interface RegistrationFormProps {
  onSubmit: (values: RegistrationFormValues) => Promise<void>;
  isLoading: boolean;
  errorMessage?: string;
  successMessage?: string;
}

interface RegistrationFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const RegistrationForm = ({ onSubmit, isLoading, errorMessage, successMessage }: RegistrationFormProps) => {
  const [values, setValues] = useState<RegistrationFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<RegistrationFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = (): RegistrationFormErrors => {
    const nextErrors: RegistrationFormErrors = {};

    if (!values.firstName.trim()) {
      nextErrors.firstName = 'First name is required.';
    }

    if (!values.lastName.trim()) {
      nextErrors.lastName = 'Last name is required.';
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!emailPattern.test(values.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!values.password) {
      nextErrors.password = 'Password is required.';
    } else if (values.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    if (!values.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    return nextErrors;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {errorMessage ? (
        <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{successMessage}</div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="register-first-name" className="block text-sm font-medium text-gray-700">
            First name
          </label>
          <input
            id="register-first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={values.firstName}
            onChange={handleChange}
            className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Jane"
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? 'register-first-name-error' : undefined}
          />
          {errors.firstName ? <p id="register-first-name-error" className="mt-2 text-sm text-red-600">{errors.firstName}</p> : null}
        </div>

        <div>
          <label htmlFor="register-last-name" className="block text-sm font-medium text-gray-700">
            Last name
          </label>
          <input
            id="register-last-name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={values.lastName}
            onChange={handleChange}
            className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Doe"
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? 'register-last-name-error' : undefined}
          />
          {errors.lastName ? <p id="register-last-name-error" className="mt-2 text-sm text-red-600">{errors.lastName}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'register-email-error' : undefined}
        />
        {errors.email ? <p id="register-email-error" className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative mt-2">
          <input
            id="register-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
            className="block w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="At least 8 characters"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'register-password-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password ? <p id="register-password-error" className="mt-2 text-sm text-red-600">{errors.password}</p> : null}
      </div>

      <div>
        <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700">
          Confirm password
        </label>
        <div className="relative mt-2">
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={handleChange}
            className="block w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Repeat your password"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? 'register-confirm-password-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((current) => !current)}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700"
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword ? <p id="register-confirm-password-error" className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p> : null}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
};
export default RegistrationForm;
