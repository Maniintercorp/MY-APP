import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button } from '@/components/ui';
import { AuthErrorMessage } from '../components/AuthErrorMessage';
import { useLoginMutation } from '../hooks';
import { LoginRequest } from '../types';

function validateLoginForm(fields: LoginRequest) {
  const errors: Partial<Record<keyof LoginRequest, string>> = {};
  if (!fields.usernameOrEmail.trim()) {
    errors.usernameOrEmail = 'Username or email is required.';
  }
  if (!fields.password) {
    errors.password = 'Password is required.';
  } else if (fields.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }
  return errors;
}

export const LoginPage = () => {
  const [fields, setFields] = useState<LoginRequest>({ usernameOrEmail: '', password: '' });
  const [errors, setErrors] = useState<{ [k in keyof LoginRequest]?: string }>({});
  const [apiError, setApiError] = useState<string>('');
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLoginMutation({
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    },
    onError: (err: any) => {
      setApiError(err?.response?.data?.message || 'Invalid credentials.');
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
    const validation = validateLoginForm(fields);
    setErrors(validation);
    setApiError('');
    if (Object.keys(validation).length === 0) {
      login(fields);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg px-8 pt-8 pb-6 w-full max-w-md border">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login
        </h1>
        <AuthErrorMessage error={apiError} />
        <Input
          label="Username or Email"
          name="usernameOrEmail"
          value={fields.usernameOrEmail}
          onChange={handleChange}
          error={errors.usernameOrEmail}
          autoComplete="username"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={fields.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-2"
          loading={isPending}
        >
          Log in
        </Button>
        <div className="text-sm text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};
export default LoginPage;
