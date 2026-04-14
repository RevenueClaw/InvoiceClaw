import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/clients`);
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email) return;

    try {
      await fetch(`${apiUrl}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      setNewClient({ name: '', email: '', phone: '' });
      setShowForm(false);
      fetchClients();
    } catch (err) {
      alert('Failed to create client. Check console for details.');
      console.error(err);
    }
  };

  const deleteClient = async (id: number) => {
    if (!confirm('Delete this client? This action cannot be undone.')) return;

    try {
      await fetch(`${apiUrl}/api/clients/${id}`, { method: 'DELETE' });
      fetchClients();
    } catch (err) {
      alert('Failed to delete client');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading clients...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" /> 
          Add New Client
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Client</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createClient} className="space-y-4">
              <Input 
                placeholder="Client Name" 
                value={newClient.name} 
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} 
                required 
              />
              <Input 
                type="email" 
                placeholder="Email Address" 
                value={newClient.email} 
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} 
                required 
              />
              <Input 
                placeholder="Phone (optional)" 
                value={newClient.phone} 
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} 
              />
              <div className="flex gap-3">
                <Button type="submit">Create Client</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {clients.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              No clients yet. Click "Add New Client" to get started.
            </CardContent>
          </Card>
        ) : (
          clients.map((client) => (
            <Card key={client.id}>
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{client.name}</h3>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                  {client.phone && <p className="text-sm text-muted-foreground">{client.phone}</p>}
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => deleteClient(client.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Clients;
