import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

import { 
  Home, 
  FileText, 
  PlusCircle, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings 
} from 'lucide-react';

import { Link, useLocation } from 'react-router-dom';

export function AppSidebar() {
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", icon: Home, path: "/" },
    { title: "Invoices", icon: FileText, path: "/invoices" },
    { title: "Create Invoice", icon: PlusCircle, path: "/create" },
    { title: "Clients", icon: Users, path: "/clients" },
    { title: "Payments", icon: CreditCard, path: "/payments" },
    { title: "Analytics", icon: BarChart3, path: "/analytics" },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
     <SidebarHeader>
  <div className="flex items-center gap-3 px-4 py-5">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white font-bold text-2xl">
      IC
    </div>
    <div>
      <div className="font-semibold text-xl tracking-tight text-foreground">InvoiceClaw</div>
      <div className="text-xs text-muted-foreground -mt-0.5">Invoice OS</div>
    </div>
  </div>
</SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Core</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
