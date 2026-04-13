import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'; // Assume added or use custom
import { Menu, LayoutDashboard, FileText, Users, Settings } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle'; // Will create next

export function Sidebar() {
  const location = useLocation();

  return (
    <>
      <SidebarInset />
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
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
            <nav className="grid gap-2">
              <Link to="/" className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${location.pathname === '/' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link to="/invoices" className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${location.pathname === '/invoices' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
                <FileText className="h-4 w-4" />
                Invoices
              </Link>
              <Link to="/clients" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground">
                <Users className="h-4 w-4" />
                Clients
              </Link>
              <Link to="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
            <div className="mt-auto">
              <ThemeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
