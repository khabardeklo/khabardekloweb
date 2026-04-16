# Khabar Deklo - Full Stack News Website

Stack used:
- Frontend: Next.js + TypeScript + Tailwind CSS
- Admin: Next.js + TypeScript + Tailwind CSS
- Backend: Express + TypeScript + MongoDB + JWT + Refresh Token

## Project folders
- frontend: Public news website
- admin: Admin panel for managing news
- backend: API and authentication service

## Setup

### 1) Install dependencies

```bash
cd frontend && npm install
cd ../admin && npm install
cd ../backend && npm install
```

### 2) Configure environment variables
- Copy `frontend/.env.example` to `frontend/.env.local`
- Copy `admin/.env.example` to `admin/.env.local`
- Copy `backend/.env.example` to `backend/.env`

### 3) Run apps

```bash
cd frontend && npm run dev
cd admin && npm run dev
cd backend && npm run dev
```

Default URLs:
- Frontend: http://localhost:3000
- Admin: http://localhost:3001
- Backend: http://localhost:5000
