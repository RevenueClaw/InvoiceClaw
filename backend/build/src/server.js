// @ts-nocheck
const express = require('express');
const middleware = require('./middleware');
const controllers = require('./controllers');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(middleware());
app.use('/api/invoices', controllers.invoiceRouter);
app.use('/api/clients', controllers.clientRouter);
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
module.exports = app;
