"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const multer_1 = __importDefault(require("multer"));
const ai_1 = __importDefault(require("./routes/ai"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const express = require('express');
const { default: middleware } = require('./middleware');
const controllers = require('./controllers');
const app = express();
const port = process.env.PORT || 3000;
app.use('/api', ai_1.default);
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
