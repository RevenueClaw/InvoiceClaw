import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="pt-20 pb-12">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
