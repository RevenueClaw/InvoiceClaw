import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, LayoutDashboard, FileText, Users, Settings } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

import { cn } from '@/lib/utils';

const navClass = (isActive: boolean) => cn(
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
  isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
);

const SidebarNav = () => {
  const location = useLocation();

  return (
    <nav className="grid gap-2">
      <Link to="/" className={navClass(location.pathname === '/')}>
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Link>
      <Link to="/invoices" className={navClass(location.pathname === '/invoices')}>
        <FileText className="h-4 w-4" />
        Invoices
      </Link>
      <Link to="/clients" className={navClass(false)}>
        <Users className="h-4 w-4" />
        Clients
      </Link>
      <Link to="/settings" className={navClass(false)}>
        <Settings className="h-4 w-4" />
        Settings
      </Link>
    </nav>
  );
};

const Sidebar: React.FC = () => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter:blur(20px)]:bg-background/60 z-50">
        <div className="flex h-full flex-col gap-2 p-4 pt-8">
          <div className="flex items-center gap-3 px-3">
            <div className="flex items-center gap-2 font-bold text-xl">
              <FileText className="h-6 w-6" />
              InvoiceClaw
            </div>
          </div>
          <SidebarNav />
          <div className="mt-auto">
            <ThemeToggle />
          </div>
        </div>
      </div>
      {/* Mobile Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed left-4 top-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 border-r-0">
          <div className="flex h-full flex-col gap-2 p-4 pt-8">
            <div className="flex items-center gap-3 px-3">
              <div className="flex items-center gap-2 font-bold text-xl">
                <FileText className="h-6 w-6" />
                InvoiceClaw
              </div>
            </div>
            <SidebarNav />
            <div className="mt-auto">
              <ThemeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      {/* Sidebar Spacer */}
      <div className="lg:pl-64" />
    </>
  );
};

export default Sidebar;
