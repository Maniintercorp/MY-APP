import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button } from '@/components/ui';
import { AuthErrorMessage } from '../components/AuthErrorMessage';
import { useRegisterMutation } from '../hooks';
import { RegisterRequest } from '../types';

function emailValid(email: string) {
  // RFC2822 basic pattern
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegisterForm(fields: RegisterRequest) {
  const errors: Partial<Record<keyof RegisterRequest, string>> = {};
  if (!fields.username.trim()) {
    errors.username = 'Username is required.';
  }
  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailValid(fields.email)) {
    errors.email = 'Invalid email address.';
  }
  if (!fields.password) {
    errors.password = 'Password is required.';
  } else {
    // UPDATED: match backend requirements (>=8, 1 upper, 1 lower, 1 digit)
    if (fields.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    } else if (!/[A-Z]/.test(fields.password)) {
      errors.password = 'Password must contain an uppercase letter.';
    } else if (!/[a-z]/.test(fields.password)) {
      errors.password = 'Password must contain a lowercase letter.';
    } else if (!/\d/.test(fields.password)) {
      errors.password = 'Password must contain a digit.';
    }
  }
  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (fields.confirmPassword !== fields.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  return errors;
}

export const RegisterPage = () => {
  const [fields, setFields] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [k in keyof RegisterRequest]?: string }>({});
  const [apiError, setApiError] = useState<string>('');
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegisterMutation({
    onSuccess: (data) => {
      // Optionally store user info or redirect
      // Optionally: localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    },
    onError: (err: any) => {
      setApiError(err?.response?.data?.message || 'Unable to register.');
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: undefined }));
    setApiError('');
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validation = validateRegisterForm(fields);
    setErrors(validation);
    setApiError('');
    if (Object.keys(validation).length === 0) {
      register(fields);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg px-8 pt-8 pb-6 w-full max-w-md border">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <AuthErrorMessage error={apiError} />
        <Input
          label="Username"
          name="username"
          value={fields.username}
          onChange={handleChange}
          error={errors.username}
          autoComplete="username"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={fields.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={fields.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={fields.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-2"
          loading={isPending}
        >
          Register
        </Button>
        <div className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};
export default RegisterPage;
