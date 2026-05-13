import { useState } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const saveToken = (userToken: string) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return {
    token,
    saveToken,
    logout,
  };
};