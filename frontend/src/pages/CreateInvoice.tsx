import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceData {
  client: string;
  invoiceNumber?: string;
  lineItems: LineItem[];
  dueDate: string;
}
  client: string;
  amount: number;
  description: string;
  dueDate: string;
}

const API_URL = import.meta.env.VITE_API_URL as string;

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<InvoiceData>({
    client: '',
    invoiceNumber: '',
    lineItems: [{description: '', quantity: 1, rate: 0}],
    dueDate: '',
  });
    client: '',
    amount: 0,
    description: '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, {description: '', quantity: 1, rate: 0}]
    }));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map((item, i) => i === index ? {...item, [field]: field === 'quantity' || field === 'rate' ? parseFloat(value as string) || 0 : value} : item)
    }));
  };

  const removeLineItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index)
    }));
  };

  const subtotal = formData.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'invoiceNumber' ? value : value
    }));
  };
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
            Client Name *
          </label>
          <input
            type="text"
            id="client"
            name="client"
            required
            value={formData.client}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="Acme Corp"
          />
        </div>

        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-semibold text-gray-900 mb-2">
            Invoice # (optional)
          </label>
          <input
            type="text"
            id="invoiceNumber"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="#001"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            Line Items
          </label>
          <div className="space-y-4 mb-6">
            {formData.lineItems.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 w-full"
                  min="0"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Rate $"
                    value={item.rate}
                    onChange={(e) => updateLineItem(index, 'rate', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    step="0.01"
                  />
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="px-3 py-3 text-red-600 hover:text-red-800 rounded-xl hover:bg-red-50"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addLineItem}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all font-medium"
          >
            + Add Line Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-900 mb-2">
              Due Date *
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              required
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Tax (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold text-gray-900">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
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
