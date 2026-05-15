import React from 'react';
import { RouteObject } from 'react-router-dom';
import { LoginAndSignupSplitPanelPage } from '@/features/LoginAndSignupSplitPanel/pages';
import { DashboardPage } from '@/pages/DashboardPage';

export const routes: RouteObject[] = [
  { path: '/', element: <LoginAndSignupSplitPanelPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
];
