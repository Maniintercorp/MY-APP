import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, ArrowRight, Loader2, Mail } from 'lucide-react';
import { useLogin } from '@/features/LoginPageRedesign/hooks';
import { FormInput } from '@/features/LoginPageRedesign/components/FormInput';
import { PasswordInput } from '@/features/LoginPageRedesign/components/PasswordInput';
import { LoginFormErrors } from '@/features/LoginPageRedesign/types';

interface ApiErrorBody {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

const getLoginErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const data = error.response?.data;
    const firstValidationMessage = data?.errors ? Object.values(data.errors).flat()[0] : undefined;
    return firstValidationMessage || data?.message || data?.error || 'Unable to sign in. Please check your credentials and try again.';
  }

  if (error instanceof Error) return error.message;

  return 'Unable to sign in. Please check your credentials and try again.';
};

const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const LoginCard = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const loginMutation = useLogin();

  const validate = (): boolean => {
    const nextErrors: LoginFormErrors = {};
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      nextErrors.email = 'Email is required.';
    } else if (!isValidEmail(normalizedEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    if (errors.email || errors.form) {
      setErrors((current) => ({ ...current, email: undefined, form: undefined }));
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (errors.password || errors.form) {
      setErrors((current) => ({ ...current, password: undefined, form: undefined }));
    }
  };

  const handleRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    loginMutation.mutate(
      { email: email.trim(), password, rememberMe },
      {
        onError: (error) => {
          setErrors((current) => ({ ...current, form: getLoginErrorMessage(error) }));
        },
      }
    );
  };

  const isSubmitting = loginMutation.isPending;

  return (
    <div className="rounded-3xl border border-white bg-white/90 p-6 shadow-2xl shadow-indigo-100 backdrop-blur sm:p-8">
      <div className="text-center sm:text-left">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 sm:mx-0">
          <ArrowRight size={22} aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-950">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Access your account with the same credentials and remember-me behavior used by the existing login flow.
        </p>
      </div>

      {errors.form ? (
        <div id="login-form-error" role="alert" className="mt-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
          <span>{errors.form}</span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate aria-describedby={errors.form ? 'login-form-error' : undefined}>
        <FormInput
          id="login-email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={handleEmailChange}
          error={errors.email}
          disabled={isSubmitting}
          icon={<Mail size={18} />}
          placeholder="you@example.com"
          required
        />

        <PasswordInput
          id="login-password"
          name="password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={handlePasswordChange}
          error={errors.password}
          disabled={isSubmitting}
          placeholder="Enter your password"
          required
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              disabled={isSubmitting}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            />
            Remember me
          </label>

          <a
            href="/forgot-password"
            className="text-sm font-semibold text-indigo-600 underline-offset-4 transition hover:text-indigo-700 hover:underline focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:shadow-none"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : null}
          <span>{isSubmitting ? 'Signing in...' : 'Sign in'}</span>
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        New to the platform?{' '}
        <Link
          to="/register"
          className="font-semibold text-indigo-600 underline-offset-4 transition hover:text-indigo-700 hover:underline focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
};
export default LoginCard;
