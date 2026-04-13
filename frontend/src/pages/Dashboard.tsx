import React, { useState, useEffect } from 'react';

const Dashboard: React.FC = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then(res => res.json())
      .then(() => setConnected(true))
      .catch(() => setConnected(false))
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">InvoiceClaw</h1>
      <p className="text-xl text-gray-600 mb-12">Smart invoice tracking with AI automation</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow">
          <p className="text-sm text-gray-500">Backend Status</p>
          <p className={`text-3xl font-bold mt-2 ${connected ? 'text-green-600' : 'text-red-600'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow">
          <p className="text-sm text-gray-500">Total Invoices</p>
          <p className="text-3xl font-bold text-gray-900">12</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow">
          <p className="text-sm text-gray-500">Outstanding</p>
          <p className="text-3xl font-bold text-amber-600">$3,240</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
