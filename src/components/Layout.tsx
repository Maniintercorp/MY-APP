import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, User, LayoutDashboard, List } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

export const Layout = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navItems: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/feature', label: 'Feature', icon: <List size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {open && (
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="h-16 px-5 flex items-center justify-between border-b border-gray-800">
            <Link to="/dashboard" className="text-lg font-semibold">SaaS App</Link>
            <button className="p-1 rounded hover:bg-gray-800" onClick={() => setOpen(false)} aria-label="Close sidebar">
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow border-b px-4 py-3 flex items-center justify-between">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-700" onClick={() => setOpen(!open)} aria-label="Toggle sidebar">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Account</span>
            <User size={24} className="text-gray-600" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default Layout;
