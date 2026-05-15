import { useContext, createContext, ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '../services';
import type { LoginRequest, RegisterRequest } from '../types';

interface AuthContextType {
  login: (data: LoginRequest) => void;
  registerUser: (data: RegisterRequest) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const loginMutation = useMutation(AuthService.login);
  const registerMutation = useMutation(AuthService.register);

  const login = async (data: LoginRequest) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const registerUser = async (data: RegisterRequest) => {
    try {
      await registerMutation.mutateAsync(data);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ login, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
