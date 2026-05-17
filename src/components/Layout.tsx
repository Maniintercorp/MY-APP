import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, User } from 'lucide-react';

export const Layout = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex h-screen bg-gray-50">
      {open && (
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
          <Link to="/feature" className="p-4">Feature</Link>
        </aside>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow border-b px-4 py-3 flex items-center justify-between">
          <button onClick={() => setOpen(!open)}><Menu size={20} /></button>
          <User size={24} className="text-gray-600" />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};