import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="flex h-screen bg-background overflow-hidden">
          <AppSidebar />

          <div className="flex flex-1 flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-auto p-6 md:p-8 pt-20">   {/* ← this pt-20 fixes the cutoff */}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/create" element={<CreateInvoice />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;
