import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthCard, AuthLayout, LoginForm, RegistrationForm } from '@/features/LoginRegistrationPage/components';
import { useAuth } from '@/features/LoginRegistrationPage/hooks';
import type { LoginFormValues, RegistrationFormValues } from '@/features/LoginRegistrationPage/types';

interface FeedbackState {
  loginSuccess?: string;
  loginError?: string;
  registerSuccess?: string;
  registerError?: string;
}

type ActiveTab = 'login' | 'register';

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }

  return 'Unable to complete your request. Please try again.';
};

export const LoginRegistrationPage = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoginPending, isRegisterPending } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('login');
  const [feedback, setFeedback] = useState<FeedbackState>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (values: LoginFormValues) => {
    setFeedback({});

    try {
      await login(values);
      setFeedback({ loginSuccess: 'Signed in successfully. Redirecting to your dashboard...' });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setFeedback({ loginError: getErrorMessage(error) });
    }
  };

  const handleRegister = async (values: RegistrationFormValues) => {
    setFeedback({});

    try {
      await register(values);
      setFeedback({ registerSuccess: 'Account created successfully. Redirecting to your dashboard...' });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setFeedback({ registerError: getErrorMessage(error) });
    }
  };

  const switchTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setFeedback({});
  };

  return (
    <AuthLayout>
      <AuthCard
        title={activeTab === 'login' ? 'Sign in to your account' : 'Create your account'}
        subtitle={
          activeTab === 'login'
            ? 'Use your email and password to continue to your workspace.'
            : 'Start with a secure account and access your dashboard right away.'
        }
        footer={
          activeTab === 'login' ? (
            <span>
              New here?{' '}
              <button type="button" onClick={() => switchTab('register')} className="font-semibold text-indigo-600 hover:text-indigo-700">
                Create an account
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button type="button" onClick={() => switchTab('login')} className="font-semibold text-indigo-600 hover:text-indigo-700">
                Sign in
              </button>
            </span>
          )
        }
      >
        <div className="mb-8 grid grid-cols-2 rounded-2xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => switchTab('login')}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchTab('register')}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Registration
          </button>
        </div>

        {activeTab === 'login' ? (
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoginPending}
            errorMessage={feedback.loginError}
            successMessage={feedback.loginSuccess}
          />
        ) : (
          <RegistrationForm
            onSubmit={handleRegister}
            isLoading={isRegisterPending}
            errorMessage={feedback.registerError}
            successMessage={feedback.registerSuccess}
          />
        )}
      </AuthCard>
    </AuthLayout>
  );
};
export default LoginRegistrationPage;
