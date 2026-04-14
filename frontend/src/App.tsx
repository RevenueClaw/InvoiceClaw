import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';

import Navbar from './components/Navbar';
import AppSidebar from './components/AppSidebar';

import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';
import Clients from './pages/Clients';

function App() {
  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex h-screen flex-col bg-background">
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <AppSidebar />
            <main className="flex-1 overflow-auto bg-background p-6 md:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/create" element={<CreateInvoice />} />
                <Route path="/clients" element={<Clients />} />
              </Routes>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
