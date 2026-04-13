# InvoiceClaw Frontend Premium Upgrade Plan

## Current Audit (basic Tailwind → shadcn premium)
- App: Router + Navbar + main content (gradient bg).
- Navbar: Fixed top links + New Invoice btn (responsive).
- Dashboard: Health check + mock KPIs (cards).
- Invoices: Fetch/table w/ status badges, search stub, create btn.
- CreateInvoice: Form w/ items array/total calc, submit to API.
- No sidebar/clients/auth/dark/charts/forms/animations/a11y yet.
- Deps ready: shadcn (20+ ui), recharts, hook-form/zod, framer-motion, lucide, sonner, next-themes.

## Roadmap (iterative commits/pushes)
1. ✅ Shell: ThemeProvider + Sidebar (sheet mobile/lucide nav) + App layout (flex/responsive/dark vars).
2. Dashboard: shadcn Cards + recharts Pie (status) / Line (trends) + Skeleton loading + motion fade-in.
3. Invoices: shadcn DataTable (columns/facets/search/filter/sort/paginate) + empty state.
4. CreateInvoice: shadcn Form (hook-form/zod validation) + drag-drop items (framer-list or array reorder) + PDF preview modal + sonner toasts.
5. Clients: New page/table CRUD stub (fetch/create/edit).
6. Auth: Login/register modals/guards (mock or API).
7. Global: Sonner toasts/error boundaries, motion page trans, tooltips, a11y (aria), mobile perf.
8. COMPLETE: Full audit/perf opt, notify.

Premium target: Linear/Stripe/Cursor—glassmorphism/gradients/shadows/subtle anims/mobile-first.