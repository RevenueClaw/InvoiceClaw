import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';

import { AppSidebar } from './components/AppSidebar';

function App() {
  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex h-screen overflow-hidden bg-background">
          {/* Left Sidebar */}
          <AppSidebar />

          {/* Right Side - Navbar + Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />

            {/* Main Content Area with proper top padding */}
            <main className="flex-1 overflow-auto p-6 md:p-8 pt-20">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/create" element={<CreateInvoice />} />
              </Routes>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
