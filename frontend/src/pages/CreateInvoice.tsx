import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Invoice {
  client: string;
  amount: number;
  description: string;
  dueDate: string;
}

const API_URL = import.meta.env.VITE_API_URL as string;

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Invoice>({
    client: '',
    amount: 0,
    description: '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create invoice');
      
      setMessage({ type: 'success', text: 'Invoice created successfully!' });
      setTimeout(() => navigate('/invoices'), 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">New Invoice</h1>
        <p className="text-lg text-gray-600">Fill in the details to create a new invoice.</p>
      </div>

      {message && (
        <div className={`mb-8 p-6 rounded-xl shadow-sm border ${
          message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
        <div>
          <label htmlFor="client" className="block text-sm font-semibold text-gray-900 mb-2">
            Client Name
          </label>
          <input
            type="text"
            id="client"
            name="client"
            required
            value={formData.client}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Acme Corp"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-semibold text-gray-900 mb-2">
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0"
            step="0.01"
            required
            value={formData.amount || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-vertical"
            placeholder="Services rendered: Web development, design, etc."
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-900 mb-2">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            required
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
