import React, { useState, useEffect } from 'react';

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
}

const Dashboard: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    invoiceCount: 0,
    pendingCount: 0,
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/invoices`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data: Invoice[] = await response.json();

      setInvoices(data.slice(0, 5)); // Show recent 5

      const totalRev = data.reduce((sum, inv) => sum + inv.amount, 0);
      const totalInv = data.length;
      const pending = data.filter(inv => inv.status === 'pending').length;

      setStats({
        totalRevenue: totalRev,
        invoiceCount: totalInv,
        pendingCount: pending,
      });

      setConnected(true);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Welcome back! Here's a quick overview of your invoices and revenue.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-500">Backend Status</span>
          </div>
          <p className={`text-3xl font-bold mt-2 ${connected ? 'text-green-600' : 'text-red-600'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Invoices</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.invoiceCount}</p>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-amber-600">{stats.pendingCount}</p>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Invoices</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-indigo-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${invoice.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'overdue': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default Dashboard;
