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

import { EyeIcon, CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const Invoices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'amount'>('dueDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
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

  const filteredInvoices = invoices.filter(inv => 
    (filterStatus === 'all' || inv.status === filterStatus) &&
    inv.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    let aVal = sortBy === 'dueDate' ? new Date(a.dueDate).getTime() : a.amount;
    let bVal = sortBy === 'dueDate' ? new Date(b.dueDate).getTime() : b.amount;
    if (sortDir === 'desc') [aVal, bVal] = [bVal, aVal];
    return aVal > bVal ? 1 : -1;
  });

  const markPaid = async (id: string) => {
    if (!confirm('Mark as paid?')) return;
    try {
      await fetch(`${API_URL}/api/invoices/${id}/status`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status: 'paid'})
      });
      setInvoices(invoices.map(inv => inv.id === id ? {...inv, status: 'paid'} : inv));
    } catch (err) {
      alert('Error updating status');
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm('Delete invoice?')) return;
    try {
      await fetch(`${API_URL}/api/invoices/${id}`, {method: 'DELETE'});
      setInvoices(invoices.filter(inv => inv.id !== id));
    } catch (err) {
      alert('Error deleting');
    }
  };

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
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Invoices</h1>
        <p className="text-lg text-gray-600">Manage and track your invoices.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('dueDate')}
            className={`px-4 py-3 rounded-xl ${sortBy === 'dueDate' ? 'btn-primary' : 'border border-gray-300 bg-white hover:bg-gray-50'}`}
          >
            Due {sortDir === 'desc' ? '↓' : '↑'}
          </button>
          <button
            onClick={() => setSortBy('amount')}
            className={`px-4 py-3 rounded-xl ${sortBy === 'amount' ? 'btn-primary' : 'border border-gray-300 bg-white hover:bg-gray-50'}`}
          >
            Amount {sortDir === 'desc' ? '↓' : '↑'}
          </button>
        </div>
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Due</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider w-32">Actions</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice, index) => (
                <tr key={invoice.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-xs text-gray-500">{invoice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusColor(invoice.status)}`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => {/* modal view */ }} title="View PDF" className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    {invoice.status !== 'paid' && (
                      <button onClick={() => markPaid(invoice.id)} title="Mark Paid" className="text-emerald-600 hover:text-emerald-900 p-1 rounded hover:bg-emerald-50">
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button onClick={() => deleteInvoice(invoice.id)} title="Delete" className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                      <TrashIcon className="h-5 w-5" />
                    </button>
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
