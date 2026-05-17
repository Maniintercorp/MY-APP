import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { LoginPage } from '@/features/LoginAndRegistrationPages/pages/LoginPage';
import { RegistrationPage } from '@/features/LoginAndRegistrationPages/pages/RegistrationPage';
import { FeaturePage } from '@/features/LoginAndRegistrationPages/pages/FeaturePage';

export const App = () => (
  <Routes>
    {/* Auth routes -- full-screen, NO sidebar/navbar */}
    <Route path="/login"    element={<LoginPage />} />
    <Route path="/register" element={<RegistrationPage />} />
    <Route path="/"         element={<Navigate to="/login" replace />} />
    {/* App routes -- always inside Layout */}
    <Route element={<Layout />}>
      <Route path="/feature"   element={<FeaturePage />} />
    </Route>
  </Routes>
);