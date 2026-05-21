import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { LoginPage } from '@/features/LoginAndRegistrationPages/pages/LoginPage';
import { RegisterPage } from '@/features/LoginAndRegistrationPages/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginAndRegistrationPagesDemoPage } from '@/features/LoginAndRegistrationPages/pages/LoginAndRegistrationPagesDemoPage';

export const App = () => (
  <Routes>
    {/* Auth routes -- full-screen, NO sidebar/navbar */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* App routes -- always inside Layout */}
    <Route element={<Layout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/feature" element={<LoginAndRegistrationPagesDemoPage />} />
    </Route>
  </Routes>
);
export default App;
