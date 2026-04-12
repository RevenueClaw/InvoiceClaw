import express from 'express';
import { PrismaClient } from '@prisma/client';
import middleware from './middleware';
import controllers from './controllers';

const app = express();
const port = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.use(express.json());
app.use(middleware());

app.use('/api/invoices', controllers.invoice);
app.use('/api/clients', controllers.client);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app; app;