import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { LoginPage } from '@/features/Auth/pages/LoginPage';
import { RegisterPage } from '@/features/Auth/pages/RegisterPage';
import { DashboardPage } from '@/features/Dashboard/pages/DashboardPage';
import { FeaturePage } from '@/features/Feature/pages/FeaturePage';

export const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/" element={<Navigate to="/login" replace />} />

    <Route element={<Layout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/feature" element={<FeaturePage />} />
    </Route>
  </Routes>
);
export default App;
