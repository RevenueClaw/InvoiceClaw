// @ts-nocheck

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const invoiceRouter = express.Router();

invoiceRouter.get('/', async (req: any, res: any) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        client: true,
        lineItems: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

invoiceRouter.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({
      where: { id: Number(id) },
      include: {
        client: true,
        lineItems: true,
      },
    });
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

invoiceRouter.post('/', async (req: any, res: any) => {
  try {
    const { clientId, lineItems, status } = req.body;

    const invoice = await prisma.invoice.create({
      data: {
        clientId,
        status: status || 'draft',
        lineItems: {
          create: lineItems.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        client: true,
        lineItems: true,
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

invoiceRouter.put('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status, lineItems } = req.body;

    const updates: any = {};

    if (status) {
      updates.status = status;
    }

    if (lineItems) {
      await prisma.lineItem.deleteMany({
        where: { invoiceId: Number(id) },
      });

      updates.lineItems = {
        create: lineItems.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      };
    }

    const invoice = await prisma.invoice.update({
      where: { id: Number(id) },
      data: updates,
      include: {
        client: true,
        lineItems: true,
      },
    });

    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

invoiceRouter.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;

    await prisma.invoice.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

const clientRouter = express.Router();

clientRouter.get('/', async (req: any, res: any) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        _count: {
          select: {
            invoices: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

clientRouter.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const client = await prisma.client.findUnique({
      where: { id: Number(id) },
      include: {
        invoices: {
          include: {
            lineItems: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

clientRouter.post('/', async (req: any, res: any) => {
  try {
    const { name, email, phone } = req.body;

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

clientRouter.put('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const client = await prisma.client.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        phone,
      },
    });

    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

clientRouter.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;

    await prisma.client.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = {
  invoiceRouter,
  clientRouter
};
