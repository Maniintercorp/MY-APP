import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useLogin } from '../hooks';
interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const loginMutation = useLogin();

  const validate = (field: keyof typeof form) => {
    if (field === 'email' && !form.email)
      return 'Email is required.';
    if (field === 'email' && !/^\S+@\S+\.\S+$/.test(form.email))
      return 'Enter a valid email address.';
    if (field === 'password' && !form.password)
      return 'Password is required.';
    return '';
  };

  const errors = {
    email: touched.email ? validate('email') : '',
    password: touched.password ? validate('password') : '',
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setFormError(null);
    if (errors.email || errors.password) return;
    loginMutation.mutate(form, {
      onSuccess: (data) => {
        if (data.error) {
          setFormError(data.error || 'Login failed');
        } else {
          setFormError(null);
          onSuccess && onSuccess();
        }
      },
      onError: () => {
        setFormError('An error occurred. Please try again.');
      },
    });
  }

  return (
    <form
      className="w-full max-w-sm mx-auto space-y-6 bg-white rounded-xl shadow-md p-8"
      onSubmit={handleSubmit}
      aria-live="polite"
      noValidate
    >
      <h1 className="text-2xl font-bold tracking-tight text-indigo-700 mb-2 text-center">Sign in to <span className="text-indigo-600 font-extrabold">MyApp</span></h1>
      <p className="text-gray-500 text-sm text-center mb-4">Welcome back! Please sign in to continue.</p>
      <div>
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="username"
          value={form.email}
          onChange={handleChange}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={errors.email}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          required
        />
      </div>
      <div className="relative">
        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={errors.password}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          ref={passwordInputRef}
          required
        />
        <button
          type="button"
          tabIndex={0}
          className="absolute right-3 top-8 text-gray-400 hover:text-indigo-600 focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onClick={() => setShowPassword((v) => !v)}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10c0 2.166-.696 4.172-1.875 5.825M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M1.5 12c1.714-4.134 6.17-7 10.5-7 3.981 0 7.579 2.029 9.375 5.172M9.88 9.88A3 3 0 0115 12c0 1.306-.837 2.417-2.01 2.83m-3.158-3.157A3 3 0 009 12c0 1.656 1.344 3 3 3 .336 0 .658-.052.962-.147" />
            </svg>
          )}
        </button>
      </div>
      {formError && (
        <div
          className="rounded-lg bg-red-50 border border-red-400 text-red-700 py-2 px-4 text-sm text-center"
          role="alert"
          aria-atomic="true"
        >
          {formError}
        </div>
      )}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loginMutation.isPending}
        loading={loginMutation.isPending}
        className="w-full mt-2"
        aria-disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
      </Button>
      {/* Example for a forgot password link
      <div className="w-full text-right mt-2">
        <a href="/forgot-password" className="text-indigo-600 text-sm font-medium hover:underline">Forgot password?</a>
      </div>*/}
    </form>
  );
};
export default LoginForm;
