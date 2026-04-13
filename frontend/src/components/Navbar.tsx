import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm dark:bg-gray-950 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            InvoiceClaw
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/">
              <Button variant={location.pathname === '/' ? "default" : "ghost"}>Dashboard</Button>
            </Link>
            <Link to="/invoices">
              <Button variant={location.pathname === '/invoices' ? "default" : "ghost"}>Invoices</Button>
            </Link>
            <Link to="/create">
              <Button>+ New Invoice</Button>
            </Link>
          </div>

          {/* Theme Toggle - This is the button we want */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
