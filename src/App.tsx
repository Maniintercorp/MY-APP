import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { LoginAndSignupSplitPanelPage } from '@/features/LoginAndSignupSplitPanel/pages';
import { DashboardPage } from '@/pages/DashboardPage';

export const App: React.FC = () => {
  return (
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
  );
};
