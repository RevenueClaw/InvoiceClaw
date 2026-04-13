import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';

function App() {
  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SidebarProvider>
          <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar - full height but starts below navbar */}
            <AppSidebar />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Fixed Navbar */}
              <Navbar />

              {/* Scrollable Main Content */}
              <main className="flex-1 overflow-auto p-6 md:p-8 pt-20">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/create" element={<CreateInvoice />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
