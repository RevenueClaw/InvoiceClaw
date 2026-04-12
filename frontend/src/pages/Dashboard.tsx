import React, { useState, useEffect } from 'react';

interface Invoice {
  id: string;
  client: string;
  amount: number;
  description: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL as string;

const Dashboard: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`${API_URL}/api/invoices`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data: Invoice[] = await response.json();
        setInvoices(data);
        setConnected(true);
        setError('');
      } catch (err) {
        setError('Backend connection failed. Check VITE_API_URL.');
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Dashboard</h1>
        <p className="text-lg text-gray-600">
          Welcome to InvoiceClaw. Manage your invoices with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-500">Backend Status</span>
          </div>
          <p className={`text-3xl font-bold mt-2 ${connected ? 'text-green-600' : 'text-red-600'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Invoices</h3>
          <p className="text-3xl font-bold text-gray-900">{totalInvoices}</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unpaid Amount</h3>
          <p className="text-3xl font-bold text-indigo-600">${(totalAmount - invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)).toFixed(2)}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-8">
          {error}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
