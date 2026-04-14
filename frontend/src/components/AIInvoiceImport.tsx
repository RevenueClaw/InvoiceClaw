import React, { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const AIInvoiceImport: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) throw new Error('VITE_API_URL not set');

      const res = await fetch(`${apiUrl}/api/invoices/import`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      console.log('✅ AI Invoice imported:', data);
      setSuccess(true);

      // Auto-refresh dashboard or go to invoices
      setTimeout(() => {
        navigate('/invoices');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      alert('❌ AI Import failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Card className="border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors">
      <CardContent className="p-8 text-center">
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`cursor-pointer rounded-xl p-10 transition-all ${isDragging ? 'bg-primary/10 scale-105' : ''}`}
        >
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={onFileSelect}
            className="hidden"
            id="invoice-upload"
          />
          <label htmlFor="invoice-upload" className="cursor-pointer flex flex-col items-center">
            {success ? (
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            ) : uploading ? (
              <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
            ) : (
              <Upload className="w-16 h-16 text-primary mb-4" />
            )}
            <h3 className="text-2xl font-semibold mb-2">AI Invoice Import</h3>
            <p className="text-muted-foreground mb-6">
              Drag &amp; drop PDF or image<br />
              <span className="text-xs">(or click to browse)</span>
            </p>
            <Button size="lg" disabled={uploading}>
              {uploading ? 'AI Extracting...' : 'Upload Invoice'}
            </Button>
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInvoiceImport;
