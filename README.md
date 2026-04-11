# Invoice Tracker SaaS

A secure, scalable web application for managing invoices, clients, and payments. Built with modern full-stack practices and designed for extensibility.

## Features
- Create, view, edit, and delete invoices
- Client management with contact details
- Invoice status tracking (draft, sent, paid, overdue)
- PDF generation for invoices
- Search and filter across invoices and clients
- User authentication and role-based access
- API-first design for integrations

## Tech Stack
- **Frontend**: React + TypeScript, Tailwind CSS, React Router, Axios
- **Backend**: Node.js + Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **PDF Generation**: pdfmake or puppeteer
- **Hosting**: Containerized with Docker, deployable to cloud platforms
- **Testing**: Jest (unit), Supertest (API)

## Project Structure
```
invoice-tracker/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── tests/
│   ├── .env
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml
├── README.md
└── LICENSE
```

## Immediate Next Steps
1. Initialize project directories
2. Set up backend with Express and TypeScript
3. Configure Prisma with PostgreSQL
4. Define data models for User, Client, Invoice, LineItem
5. Implement basic CRUD routes
6. Set up frontend project with Vite and React
7. Create basic page structure and routing
8. Connect frontend to backend API

Development will proceed with Chain-of-Thought methodology, frequent small commits, and regular state saves for persistence.