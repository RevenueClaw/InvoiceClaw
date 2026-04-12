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

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`${API_URL}/api/invoices`);
        if (!response.ok) throw new Error('Failed to fetch invoices');
        const data: Invoice[] = await response.json();
        setInvoices(data);
        setError('');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-200">
              <thead>
                <tr>
                  {['Client', 'Amount', 'Due Date', 'Status'].map((header) => (
                    <th key={header} className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-900 h-16"></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap h-20 bg-gray-200 rounded"></td>
                    <td className="px-6 py-4 whitespace-nowrap h-20 bg-gray-200 rounded"></td>
                    <td className="px-6 py-4 whitespace-nowrap h-20 bg-gray-200 rounded"></td>
                    <td className="px-6 py-4 whitespace-nowrap h-20 bg-gray-200 rounded"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Invoices</h1>
        <p className="text-lg text-gray-600 mt-2">All your invoices at a glance.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice, index) => (
                <tr key={invoice.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate">{invoice.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {invoices.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mt-2">No invoices yet. <a href="/create-invoice" className="text-blue-600 hover:underline font-medium">Create one now</a>.</p>
        </div>
      )}
    </div>
  );
};

export default Invoices;
