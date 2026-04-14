import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;

  return (
    <nav className="h-16 bg-background/95 backdrop-blur-md border-b border-border shadow-sm flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        {/* Logo - left */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
        >
          InvoiceClaw
        </Link>

        {/* Navigation buttons - perfectly centered */}
        <div className="hidden md:flex items-center gap-3 flex-1 justify-center">
          <Link to="/">
            <Button variant={location.pathname === '/' ? 'default' : 'ghost'}>
              Dashboard
            </Button>
          </Link>
          <Link to="/invoices">
            <Button variant={location.pathname === '/invoices' ? 'default' : 'ghost'}>
              Invoices
            </Button>
          </Link>
          <Link to="/create">
            <Button>+ New Invoice</Button>
          </Link>
        </div>

        {/* Dark mode toggle - far right */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
        >
          {currentTheme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
