# Multi-Tenant Tournament Platform

A modern, high-performance multi-tenant sports tournament management and page building platform built with Next.js 15 (App Router), Tailwind CSS, Prisma ORM, and Supabase.

---

## 🌟 Key Features

- **Multi-Tenant Architecture**: Organization-scoped routing, data isolation, and dynamic tenant site resolution (`/tenant/[tenantSlug]`).
- **Drag-and-Drop Page Builder**: Interactive visual builder (`/builder`) powered by `@dnd-kit` for creating custom tournament homepages with Hero Banners, Sponsor Grids, Location Maps, and Live Brackets.
- **Tournament & Bracket Management**: Single Elimination, Double Elimination, and Round Robin formats with live interactive bracket displays.
- **Platform Administration**: Admin management interface (`/platform-admin`) for provisioning tenants, toggling tenant status, and monitoring platform metrics.
- **Comprehensive Testing Suite**: Unit and integration tests written with Jest and React Testing Library (`npm test`).

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
- **UI & Styling**: React 18, Tailwind CSS, Lucide Icons, `@dnd-kit`
- **Database & ORM**: PostgreSQL, [Prisma ORM](https://www.prisma.io/)
- **Authentication & Backend Services**: [Supabase](https://supabase.com/)
- **Testing**: Jest 30, React Testing Library, `ts-jest`

---

## 🚀 Getting Started

Follow these steps to set up and run the platform locally on your machine.

### Prerequisites

- **Node.js**: `v18.x` or `v20.x` (or higher)
- **npm**: `v9.x` or higher
- **PostgreSQL Database** (or a local/cloud Supabase instance)

---

### Step 1: Clone the Repository

```bash
git clone <REPOSITORY_URL>
cd multi-tenant-tournament-platform
```

---

### Step 2: Install Dependencies

```bash
npm install
```

---

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Or manually create `.env` with the following variables:

```env
# Database Connection String (PostgreSQL / Supabase)
DATABASE_URL="postgresql://postgres:your-password@db.your-supabase-project.supabase.co:5432/postgres"

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL="https://your-supabase-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

> **Note**: For local development with Supabase CLI (`npx supabase start`), your `.env` values will typically look like:
> ```env
> DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
> NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
> NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_..."
> ```

---

### Step 4: Setup the Database

Push the Prisma schema to your database:

```bash
npx prisma db push
```

Generate the Prisma Client:

```bash
npx prisma generate
```

---

### Step 5: Seed Initial Data

Populate the database with sample organizations, users, tournaments, and pre-configured tenant pages:

```bash
npx prisma db seed
```

This provisions sample tenants such as `bay-area-pickleball` and `golden-gate-tennis`.

---

### Step 6: Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📍 Key Application Routes

| Route | Description |
| :--- | :--- |
| `/` | Platform Homepage & Navigation |
| `/platform-admin` | Platform Administration Portal (Tenant Onboarding & Governance) |
| `/builder` | Visual Drag-and-Drop Page Builder |
| `/tenant/bay-area-pickleball` | Sample Public Tenant Site (Dynamic Subdomain / Slug Route) |
| `/tournaments` | Public Tournament Listings |
| `/login` | User & Admin Login Page |

---

## 🧪 Running Tests

Execute the automated unit and integration test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate code coverage report
npm run test:coverage
```

---

## 📁 Directory Structure

```text
├── app/
│   ├── api/                 # API Routes (Tournaments, Tenants, etc.)
│   ├── builder/             # Drag-and-Drop Page Builder UI & Server Actions
│   ├── platform-admin/      # Platform Admin Portal & Organization Management
│   ├── tenant/[tenantSlug]/ # Dynamic Tenant Public Site Renderer
│   ├── tournaments/         # Public Tournament List
│   ├── layout.tsx           # Main Root Layout
│   └── page.tsx             # Home Landing Page
├── components/
│   ├── builder/             # Builder Components (HeroBanner, SponsorGrid, BracketEmbed, etc.)
│   └── ui/                  # Reusable UI Components & Icons
├── docs/                    # Architecture & Requirements Documentation
├── lib/                     # Prisma Client & Supabase Helper Utilities
├── prisma/
│   ├── schema.prisma        # Database Models & Relationships
│   └── seed.ts              # Database Seed Script
└── public/                  # Static Assets
```

---

## 🚢 Production Deployment

1. **Deploy Frontend & API**: Deploy to [Vercel](https://vercel.com) or Firebase App Hosting.
2. **Environment Variables**: Add `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your hosting dashboard.
3. **Database Migration**: Run `npx prisma db push` against your production Supabase database.
