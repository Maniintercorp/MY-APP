import React, { useState } from 'react';
import { LanguageDropdown } from '../components/LanguageDropdown';
import { Button, Input } from '@/components/ui';
import { useLoginMutation } from '../hooks/useLoginMutation';
import { I18nProvider, useI18n } from '../context/I18nContext';

// Auth fields managed locally; language context (
// via I18nProvider) wraps the actual LoginPage so t() updates on lang change

const LoginPageContent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { language, t } = useI18n();
  const login = useLoginMutation();

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    login.mutate(
      { username, password, language },
      {
        onError: () => setError(t('login.error')),
      }
    );
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full flex flex-col"
        autoComplete="off"
      >
        <LanguageDropdown />
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">{t('login.title')}</h2>
        <Input
          label={t('login.username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mb-4"
        />
        <Input
          label={t('login.password')}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4"
        />
        {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}
        <Button
          type="submit"
          variant="primary"
          className="mt-2 w-full"
          loading={login.isPending}
        >
          {login.isPending ? t('login.loading') : t('login.button')}
        </Button>
      </form>
    </div>
  );
};

// Export a page that wraps LoginPageContent with I18nProvider
export const LoginPage = () => (
  <I18nProvider>
    <LoginPageContent />
  </I18nProvider>
);
export default LoginPage;
