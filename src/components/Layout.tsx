import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, LayoutDashboard, User } from 'lucide-react';

interface NavLink {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_LINKS: NavLink[] = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} className="mr-2" />,
  },
  {
    to: '/feature',
    label: 'LoginAndRegistrationPages',
    icon: <User size={18} className="mr-2" />,
  },
];

export const Layout = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  return (
    <div className="flex h-screen bg-gray-50">
      {open && (
        <aside className="w-64 bg-gray-900 text-white flex flex-col transition-all duration-200">
          <div className="h-16 flex items-center px-6 font-bold text-lg border-b border-gray-800">App</div>
          <nav className="flex-1 px-2 py-4">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-3 py-2 rounded-md mb-1 transition-colors text-base font-medium hover:bg-gray-800 focus:outline-none ${location.pathname === item.to ? 'bg-gray-800' : ''}`}
              >
                {item.icon}{item.label}
              </Link>
            ))}
          </nav>
        </aside>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow border-b px-4 py-3 flex items-center justify-between">
          <button onClick={() => setOpen(!open)} className="mr-2"><Menu size={20} /></button>
          <User size={24} className="text-gray-600" />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default Layout;
