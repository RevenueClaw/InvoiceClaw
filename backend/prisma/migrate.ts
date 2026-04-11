import { defineConfig } from 'prisma';

export default defineConfig({
  datasources: {
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/invoice_tracker?schema=public',
    },
  },
});