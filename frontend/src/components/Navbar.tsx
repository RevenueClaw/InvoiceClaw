import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              InvoiceClaw
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-indigo-50'}`}>
              Dashboard
            </Link>
            <Link to="/invoices" className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/invoices' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-indigo-50'}`}>
              Invoices
            </Link>
            <Link to="/create-invoice" className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all">
              + New Invoice
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
