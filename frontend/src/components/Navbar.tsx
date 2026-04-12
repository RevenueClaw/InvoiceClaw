import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              InvoiceClaw
            </Link>
          </div>
          <div className="flex items-center space-x-4 lg:space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-blue-100 text-blue-700 shadow-md'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/invoices"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/invoices')
                  ? 'bg-blue-100 text-blue-700 shadow-md'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Invoices
            </Link>
            <Link
              to="/create-invoice"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700`}
            >
              + New Invoice
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
