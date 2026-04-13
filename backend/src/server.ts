// @ts-nocheck
import multer from 'multer';
import aiRoutes from './routes/ai';
import aiRoutes from './routes/ai';   // ← Add this import

const upload = multer({ storage: multer.memoryStorage() });

const express = require('express');
const { default: middleware } = require('./middleware');
const controllers = require('./controllers');

const app = express();
const port = process.env.PORT || 3000;

// AI Invoice Import Route
import aiRoutes from './routes/ai';   // Import here, AFTER app is declared
app.use('/api', aiRoutes);

app.use(express.json());
app.use(middleware());

app.use('/api/invoices', controllers.invoiceRouter);
app.use('/api/clients', controllers.clientRouter);

app.get('/health', (req: any, res: any) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
