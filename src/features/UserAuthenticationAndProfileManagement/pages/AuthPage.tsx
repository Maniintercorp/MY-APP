import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserRegistrationForm from '../components/UserRegistrationForm';
import LoginForm from '../components/LoginForm';
import UserProfile from '../components/UserProfile';

const AuthPage: React.FC = () => {
  return (
    <div className="auth-page container mx-auto mt-8">
      <Routes>
        <Route path="register" element={<UserRegistrationForm />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="profile" element={<UserProfile />} />
      </Routes>
    </div>
  );
};

export default AuthPage;