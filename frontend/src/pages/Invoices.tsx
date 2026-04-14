import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
}

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/invoices`);
      if (!response.ok) throw new Error('Failed to fetch invoices');
      const data: Invoice[] = await response.json();
      setInvoices(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
            Invoices
          </h1>
          <p className="text-xl text-muted-foreground">Manage and track all your invoices.</p>
        </div>
        <Link 
          to="/create" 
          className="self-start sm:self-end px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-semibold text-lg whitespace-nowrap"
        >
          + Create New
        </Link>
      </div>

      {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive px-6 py-4 rounded-xl mb-8">{error}</div>}

      <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{invoice.id.slice(-6)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{invoice.clientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">${invoice.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
