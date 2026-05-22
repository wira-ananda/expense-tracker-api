# Expense Tracker API

Backend API untuk aplikasi Expense Tracker. API ini menangani autentikasi, sinkronisasi user Clerk, kategori transaksi, transaksi, dan ringkasan keuangan bulanan.

## Project Overview

Expense Tracker API dibangun sebagai backend terpisah untuk dashboard Expense Tracker. API menerima request dari frontend dashboard, memvalidasi token Clerk, membaca user lokal dari database, lalu mengelola data transaksi berdasarkan user tersebut.

API ini mendukung dua alur autentikasi:

1. Manual auth lama melalui register dan login.
2. Clerk auth untuk login modern, termasuk Google login dan sinkronisasi user.

Database production memakai PostgreSQL dari NeonDB. ORM memakai Prisma.

## Tech Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- NeonDB
- Clerk Backend SDK
- JWT
- Vercel Serverless Function
- Express Adapter

## Main Features

- Register user manual.
- Login user manual.
- Sinkronisasi user Clerk ke database lokal.
- Proteksi endpoint dengan token Clerk.
- Ambil user lokal berdasarkan `clerkId`.
- Buat kategori transaksi.
- Ambil kategori user.
- Buat transaksi pemasukan dan pengeluaran.
- Ambil semua transaksi user.
- Ambil riwayat transaksi berdasarkan bulan.
- Ambil ringkasan income, expense, dan balance.
- Deploy serverless ke Vercel.

## Authentication Flow

### Clerk Sync Flow

1. User login dari dashboard menggunakan Clerk.
2. Frontend mengambil token Clerk.
3. Frontend mengirim request ke `POST /auth/clerk/sync`.
4. API memverifikasi token Clerk.
5. API membuat atau memperbarui user lokal berdasarkan `clerkId`.
6. API membuat default category untuk user baru.
7. Dashboard memakai user lokal untuk transaksi, kategori, dan summary.

### Protected Route Flow

Endpoint seperti `/categories`, `/transactions`, dan `/summary` memakai `ClerkUserGuard`.

Flow:

1. Request membawa `Authorization: Bearer <clerk_token>`.
2. Guard memverifikasi token Clerk.
3. Guard mencari user lokal berdasarkan `clerkId`.
4. Guard menyimpan user lokal ke `req.user`.
5. Controller mengambil user melalui `@CurrentUser()`.
6. Service menjalankan query berdasarkan `user.id`.

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register user manual | Public |
| POST | `/auth/login` | Login user manual | Public |
| GET | `/auth/me` | Ambil user aktif | Clerk |
| POST | `/auth/clerk/sync` | Sinkronisasi user Clerk | Clerk |
| PATCH | `/auth/clerk/profile` | Update profil user Clerk | Clerk |

### Categories

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/categories` | Ambil semua kategori user | Clerk user |
| POST | `/categories` | Buat kategori baru | Clerk user |

### Transactions

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/transactions` | Ambil semua transaksi user | Clerk user |
| POST | `/transactions` | Buat transaksi baru | Clerk user |
| GET | `/transactions/:id` | Ambil detail transaksi | Clerk user |
| PATCH | `/transactions/:id` | Update transaksi | Clerk user |
| DELETE | `/transactions/:id` | Hapus transaksi | Clerk user |
| GET | `/transactions/history/by-month` | Ambil transaksi berdasarkan bulan | Clerk user |

### Summary

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/summary` | Ambil total income, expense, dan balance | Clerk user |

Query optional:

```txt
/summary?month=2026-05
```

## Environment Variables

Buat file `.env` untuk local development.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
JWT_SECRET="your_jwt_secret"
CLERK_SECRET_KEY="sk_test_or_sk_live_xxx"
CLERK_AUTHORIZED_PARTIES="http://localhost:3000,https://your-dashboard-domain.vercel.app"
FRONTEND_URL="http://localhost:3000,https://your-dashboard-domain.vercel.app"
PORT=5172
```

Notes:

- `DATABASE_URL` dipakai oleh Prisma Client runtime.
- `DIRECT_URL` dipakai untuk migration ke NeonDB.
- Jangan commit file `.env`.
- Jangan menaruh secret di README public.

## Folder Structure

```txt
expense-tracker-api/
├─ api/
│  └─ index.ts
├─ prisma/
│  ├─ migrations/
│  ├─ schema.prisma
│  └─ seed.ts
├─ src/
│  ├─ common/
│  │  └─ decorator/
│  │     └─ current-user.decorator.ts
│  ├─ constants/
│  │  └─ default-categories.ts
│  ├─ controller/
│  │  ├─ auth.controller.ts
│  │  ├─ category.controller.ts
│  │  ├─ summary.controller.ts
│  │  └─ transactions.controller.ts
│  ├─ dto/
│  │  ├─ auth/
│  │  ├─ category/
│  │  └─ transactions/
│  ├─ guards/
│  │  ├─ clerk-auth.guard.ts
│  │  └─ clerk-user.guard.ts
│  ├─ interface/
│  │  ├─ transactions.interface.ts
│  │  └─ users.interface.ts
│  ├─ module/
│  │  ├─ auth.module.ts
│  │  ├─ category.module.ts
│  │  ├─ prisma.module.ts
│  │  ├─ summary.module.ts
│  │  └─ transactions.module.ts
│  ├─ service/
│  │  ├─ auth.service.ts
│  │  ├─ category.service.ts
│  │  ├─ prisma.service.ts
│  │  ├─ summary.service.ts
│  │  └─ transactions.service.ts
│  ├─ utils/
│  │  └─ build.default-categories.ts
│  ├─ app.module.ts
│  └─ main.ts
├─ package.json
├─ prisma.config.ts
└─ vercel.json
```

## Local Setup

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run migration local:

```bash
npx prisma migrate dev
```

Run development server:

```bash
npm run dev
```

Default local API:

```txt
http://localhost:5172
```

## Production Build

```bash
npm run build
```

Production start for normal Node hosting:

```bash
npm run start:prod
```

For Vercel, the entrypoint is:

```txt
api/index.ts
```

## Vercel Deployment Notes

API ini memakai Vercel Serverless Function melalui `api/index.ts`.

Important notes:

- CORS harus di-handle di `api/index.ts`.
- `OPTIONS` preflight harus dijawab sebelum Nest bootstrap.
- `prisma generate` harus berjalan saat build.
- Environment variables wajib diisi di Vercel Project Settings.
- Redeploy tanpa cache jika perubahan env atau build tidak terbaca.

## Common Issues

### 401 on `/auth/clerk/sync`

Penyebab umum:

- Token Clerk tidak terkirim.
- `CLERK_SECRET_KEY` salah.
- Publishable key frontend dan secret key backend berasal dari project Clerk yang berbeda.
- `authorizedParties` terlalu ketat.

### 500 on `/categories`, `/transactions`, or `/summary`

Penyebab umum:

- `req.user` belum diset oleh guard.
- Endpoint protected masih memakai guard yang salah.
- User Clerk belum tersinkronisasi ke database lokal.
- Prisma Client belum generated di production.

### CORS Failed to Fetch

Penyebab umum:

- `FRONTEND_URL` belum diisi di Vercel API.
- Domain frontend tidak sama dengan origin browser.
- Preflight `OPTIONS` tidak dijawab oleh API.

## Recommended Commit Format

Gunakan Conventional Commit.

```bash
feat(api): add Clerk user sync
fix(api): resolve Clerk user for protected routes
fix(api): handle Vercel CORS preflight
chore(api): configure Vercel deployment
```

## Status

API sudah dirancang untuk terhubung dengan dashboard Expense Tracker, Clerk Auth, NeonDB, dan Vercel.
