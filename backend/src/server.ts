const express = require('express');
const { PrismaClient } = require('@prisma/client');
const middleware = require('./middleware');
const controllers = require('./controllers');

const app = express();
const port = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.use(express.json());
app.use(middleware());

app.use('/api/invoices', controllers.invoiceRouter);
app.use('/api/clients', controllers.clientRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;