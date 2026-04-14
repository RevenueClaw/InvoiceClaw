import express from 'express';
import multer from 'multer';
import { generateObject } from 'ai';
import { createXai } from '@ai-sdk/xai';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const xai = createXai({ apiKey: process.env.XAI_API_KEY! });
const prisma = new PrismaClient();

const upload = multer({ storage: multer.memoryStorage() });

// Zod schema for AI extraction
const InvoiceExtractionSchema = z.object({
  clientName: z.string(),
  clientEmail: z.string().email().optional(),
  invoiceNumber: z.string().optional(),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  lineItems: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    amount: z.number(),
  })),
  subtotal: z.number(),
  taxRate: z.number().optional().default(0),
  taxAmount: z.number().optional(),
  total: z.number(),
  currency: z.string().default('USD'),
  notes: z.string().optional(),
});

router.post(
  '/invoices/import',
  upload.single('file'),   // ← auth removed for now
  async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const base64Image = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype;

      const { object } = await generateObject({
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
          userId: 1,   // ← temporary placeholder (change later to real user)
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
            create: object.lineItems.map((item: any) => ({
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
    } catch (error: any) {
      console.error('AI Import Error:', error);
      res.status(500).json({ 
        error: 'Failed to process invoice with AI',
        details: error.message 
      });
    }
  }
);

export default router;
