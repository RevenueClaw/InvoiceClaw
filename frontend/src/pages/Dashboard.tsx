import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from 'next-themes';
import AIInvoiceImport from '../components/AIInvoiceImport';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const Dashboard: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  const COLORS = resolvedTheme === 'dark'
    ? ['#10b981', '#f59e0b', '#ef4444']
    : ['#10b981', '#f59e0b', '#ef4444'];

  const LINE_COLOR = resolvedTheme === 'dark' ? '#22c55e' : '#10b981';

  const mockInvoicesData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
  ];

  const mockStatusData = [
    { name: 'Paid', value: 60 },
    { name: 'Pending', value: 30 },
    { name: 'Overdue', value: 10 },
  ];

  useEffect(() => {
    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      setConnected(false);
      setLoading(false);
      return;
    }
    fetch(`${apiUrl}/health`)
      .then(res => res.json())
      .then(() => setConnected(true))
      .catch(() => setConnected(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <AIInvoiceImport />

      <div className="text-sm text-muted-foreground">
        Backend: {connected ? '✅ Connected' : '❌ Disconnected'}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">124</div></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">$12,450</div></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">$2,340</div></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Lifetime Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">$89,420</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={mockStatusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ percent }) => percent ? `${(percent * 100).toFixed(0)}%` : ''}>
                  {mockStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockInvoicesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke={LINE_COLOR} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
