import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
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

const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // green, amber, red

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

const Dashboard: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then(res => res.json())
      .then(() => setConnected(true))
      .catch(() => setConnected(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-6 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">Overview of your invoices and payments</p>
        </div>
        <Badge variant={connected ? "default" : "destructive"} className="mt-4 sm:mt-0 self-start">
          Backend: {connected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KPIs */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>Business performance at a glance</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 p-0">
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-foreground">124</div>
              <div className="text-sm text-muted-foreground mt-1">Total Invoices</div>
            </div>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">$12,450</div>
              <div className="text-sm text-muted-foreground mt-1">Outstanding</div>
            </div>
            <div className="p-6 text-center border-t">
              <div className="text-3xl font-bold text-destructive">$2,340</div>
              <div className="text-sm text-muted-foreground mt-1">Overdue</div>
            </div>
            <div className="p-6 text-center border-t">
              <div className="text-3xl font-bold text-secondary">$89,420</div>
              <div className="text-sm text-muted-foreground mt-1">Lifetime Revenue</div>
            </div>
          </CardContent>
        </Card>

        {/* Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Status</CardTitle>
            <CardDescription>Distribution of your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={mockStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => name + (percent ? ` ${(percent * 100).toFixed(0)}%` : '')}
                >
                  {mockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Monthly revenue over the last year</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockInvoicesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Dashboard;