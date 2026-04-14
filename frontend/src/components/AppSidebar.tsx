import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FileText, PlusCircle, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const AppSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/invoices', label: 'Invoices', icon: FileText },
    { path: '/clients', label: 'Clients', icon: Users },
  ];

  return (
    <div className={cn('h-full bg-background border-r border-border flex flex-col transition-all duration-300 ease-in-out shadow-sm', isCollapsed ? 'w-16' : 'w-64')}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-x-3">
          <div className="h-9 w-9 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-2xl shadow-inner">IC</div>
          {!isCollapsed && <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent tracking-tighter">InvoiceClaw</span>}
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-x-3 px-3 py-3 rounded-2xl text-sm font-medium transition-colors',
                isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50 text-foreground/80 hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        <div className="mt-8 px-3">
          {!isCollapsed ? (
            <Link to="/create" className="flex items-center justify-center gap-x-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-3xl text-sm transition-all w-full">
              <PlusCircle className="h-4 w-4" /> New Invoice
            </Link>
          ) : (
            <Button asChild variant="default" size="icon" className="w-full">
              <Link to="/create"><PlusCircle className="h-5 w-5" /></Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
