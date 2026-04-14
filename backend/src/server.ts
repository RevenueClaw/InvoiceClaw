// @ts-nocheck
import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai';

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS for Vercel + local dev
app.use(cors({
  origin: [
    'https://invoice-claw.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

// AI routes (includes /api/invoices/import)
app.use('/api', aiRoutes);

// Your existing controllers
app.use('/api/invoices', require('./controllers').invoiceRouter);
app.use('/api/clients', require('./controllers').clientRouter);

app.get('/health', (req: any, res: any) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;  // optional, for consistency
