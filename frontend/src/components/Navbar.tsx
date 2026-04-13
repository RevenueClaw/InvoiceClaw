import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Use resolvedTheme to avoid hydration mismatch
  const currentTheme = resolvedTheme || theme;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            InvoiceClaw
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-3">
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

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
          >
            {currentTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
