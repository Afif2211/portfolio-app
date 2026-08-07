# Portfolio — Afif Ahmad

Monorepo for a dark, gradient-themed, 3D-hero portfolio site.

## Structure
- `frontend/` — React + Vite + React Three Fiber + Tailwind
- `backend/` — Express + MongoDB (contact form + project data API)

## Run locally

Backend (runs on port 6060):
```
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI (use a fresh, rotated password)
npm run dev
```

Frontend (runs on port 3030):
```
cd frontend
npm install
cp .env.example .env
npm run dev
```
