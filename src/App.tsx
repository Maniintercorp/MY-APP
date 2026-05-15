import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { LoginAndSignupSplitPanelPage } from '@/features/LoginAndSignupSplitPanel/pages';
import { DashboardPage } from '@/pages/DashboardPage';

export const App: React.FC = () => {
  return (
<<<<<<< HEAD
    <Routes>
      <Route path="/" element={<LoginAndSignupSplitPanelPage />} />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <DashboardPage />
          </Layout>
        }
      />
    </Routes>
=======
    <Layout>
      <Routes>
        <Route path="/" element={<LoginAndSignupSplitPanelPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Layout>
>>>>>>> 31f24afbd74987b042d98fd9181b003d66ce1a4b
  );
};
