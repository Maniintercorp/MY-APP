import { BarChart2, Users, TrendingUp } from 'lucide-react';
import { DashboardMetric } from '@/features/Dashboard/types';

const metrics: DashboardMetric[] = [
  { label: 'Revenue', value: '$24,580', change: '+12.5%' },
  { label: 'Users', value: '1,248', change: '+8.2%' },
  { label: 'Growth', value: '18.4%', change: '+3.1%' },
];

export const DashboardPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-600">A quick overview of your workspace performance.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric, index) => {
        const icons = [BarChart2, Users, TrendingUp];
        const Icon = icons[index];
        return (
          <div key={metric.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">{metric.label}</span>
              <Icon size={20} className="text-indigo-600" />
            </div>
            <div className="mt-4 text-2xl font-bold text-gray-900">{metric.value}</div>
            <div className="mt-1 text-sm font-medium text-green-600">{metric.change}</div>
          </div>
        );
      })}
    </div>
  </div>
);
export default DashboardPage;
