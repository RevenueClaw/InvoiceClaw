import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    taxRate: 0,
    notes: '',
  });
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', quantity: 1, price: 0 }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * (formData.taxRate / 100);
  const total = subtotal + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { description: '', quantity: 1, price: 0 }]);

  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, items, subtotal, tax, total }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Invoice created successfully!' });
        setTimeout(() => navigate('/invoices'), 1500);
      } else {
        throw new Error('Failed to create invoice');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
          New Invoice
        </h1>
        <p className="text-xl text-gray-600">Create a professional invoice for your client.</p>
      </div>

      {message && (
        <div className={`mb-8 p-6 rounded-2xl border ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
        {/* Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name</label>
            <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500" placeholder="Acme Corp" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Client Email</label>
            <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500" placeholder="client@example.com" />
          </div>
        </div>

        {/* Items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-semibold text-gray-900">Invoice Items</label>
            <button type="button" onClick={addItem} className="text-indigo-600 hover:text-indigo-700 font-medium">+ Add Item</button>
          </div>
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-end">
              <div className="col-span-6">
                <input type="text" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} placeholder="Description" className="w-full px-4 py-3 border border-gray-200 rounded-2xl" />
              </div>
              <div className="col-span-2">
                <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} min="1" className="w-full px-4 py-3 border border-gray-200 rounded-2xl" />
              </div>
              <div className="col-span-3">
                <input type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)} step="0.01" className="w-full px-4 py-3 border border-gray-200 rounded-2xl" placeholder="0.00" />
              </div>
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(index)} className="col-span-1 text-red-500 hover:text-red-700">×</button>
              )}
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="bg-gray-50 rounded-2xl p-6 text-right">
          <div className="space-y-2">
            <p>Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span></p>
            <p>Tax ({formData.taxRate}%): <span className="font-semibold">${tax.toFixed(2)}</span></p>
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-semibold text-lg hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50">
          {loading ? 'Creating Invoice...' : 'Create & Send Invoice'}
        </button>
      </form>
    </div>
  );
};

export default CreateInvoice;
