"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const ai_1 = require("ai");
const xai_1 = require("@ai-sdk/xai");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const xai = (0, xai_1.createXai)({ apiKey: process.env.XAI_API_KEY });
const prisma = new client_1.PrismaClient();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Zod schema for AI extraction
const InvoiceExtractionSchema = zod_1.z.object({
    clientName: zod_1.z.string(),
    clientEmail: zod_1.z.string().email().optional(),
    invoiceNumber: zod_1.z.string().optional(),
    issueDate: zod_1.z.string().optional(),
    dueDate: zod_1.z.string().optional(),
    lineItems: zod_1.z.array(zod_1.z.object({
        description: zod_1.z.string(),
        quantity: zod_1.z.number(),
        unitPrice: zod_1.z.number(),
        amount: zod_1.z.number(),
    })),
    subtotal: zod_1.z.number(),
    taxRate: zod_1.z.number().optional().default(0),
    taxAmount: zod_1.z.number().optional(),
    total: zod_1.z.number(),
    currency: zod_1.z.string().default('USD'),
    notes: zod_1.z.string().optional(),
});
router.post('/invoices/import', upload.single('file'), // ← auth removed for now
async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const base64Image = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;
        const { object } = await (0, ai_1.generateObject)({
            model: xai('grok-4-1-fast'),
            schema: InvoiceExtractionSchema,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Extract all invoice details from this document accurately. Return clean structured data only.' },
                        { type: 'image', image: `data:${mimeType};base64,${base64Image}` },
                    ],
                },
            ],
        });
        const invoice = await prisma.invoice.create({
            data: {
                userId: 1, // ← temporary placeholder (change later to real user)
                clientName: object.clientName,
                clientEmail: object.clientEmail,
                invoiceNumber: object.invoiceNumber || `INV-${Date.now()}`,
                issueDate: object.issueDate ? new Date(object.issueDate) : new Date(),
                dueDate: object.dueDate ? new Date(object.dueDate) : undefined,
                status: 'draft',
                subtotal: object.subtotal,
                taxRate: object.taxRate || 0,
                taxAmount: object.taxAmount || 0,
                total: object.total,
                currency: object.currency,
                notes: object.notes,
                lineItems: {
                    create: object.lineItems.map((item) => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        amount: item.amount,
                    })),
                },
            },
            include: { lineItems: true },
        });
        res.json({ success: true, invoice });
    }
    catch (error) {
        console.error('AI Import Error:', error);
        res.status(500).json({
            error: 'Failed to process invoice with AI',
            details: error.message
        });
    }
});
exports.default = router;
