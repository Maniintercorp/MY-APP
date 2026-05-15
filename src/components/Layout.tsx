import React, { useState } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { User } from 'lucide-react';
=======
import { UserCircle } from 'lucide-react';
>>>>>>> 31f24afbd74987b042d98fd9181b003d66ce1a4b

const navLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'LoginAndSignupSplitPanel', path: '/' },
  { name: 'Settings', path: '/settings' },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <aside className={`bg-gray-900 text-white w-64 p-4 transition ${sidebarOpen ? 'block' : 'hidden'}`}>
        <nav>
          <ul>
            {navLinks.map((link) => (
              <li key={link.name} className="mb-2">
                <Link to={link.path} className="block p-2 rounded-lg hover:bg-gray-700 transition">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow border-b p-4 flex justify-between items-center">
          <button
            className="text-gray-900 p-2 focus:outline-none focus:bg-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
<<<<<<< HEAD
          <User className="text-gray-900" size={28} />
=======
          <UserCircle className="text-gray-900" size={28} />
>>>>>>> 31f24afbd74987b042d98fd9181b003d66ce1a4b
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};
