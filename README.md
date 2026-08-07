# Portfolio — Afif Ahmad

A dark, gradient-themed portfolio site with an interactive 3D solar system hero, built as a MERN monorepo.

**Live site:** https://portfolio-app-five-jade.vercel.app
**Backend API:** https://portfolio-backend-stth.onrender.com

---

## Structure

```
portfolio/
├── frontend/   React + Vite + React Three Fiber + Tailwind
└── backend/    Express + MongoDB (contact form + project data API)
```

### Frontend highlights
- Interactive 3D solar system hero (React Three Fiber + postprocessing), lazy-loaded so it doesn't block initial page render
- Typewriter-animated headline
- Scroll-linked animations throughout (Framer Motion)
- Client-side routing (React Router) with a custom 404 page
- Mobile-responsive nav with hamburger menu
- Contact form wired to the backend API

### Backend highlights
- Express REST API
- MongoDB (via Mongoose) for storing contact form submissions
- Email notifications on new contact messages (Nodemailer via Gmail)
- CORS locked to the deployed frontend URL

---

## Tech stack

**Frontend:** React, Vite, Tailwind CSS, React Three Fiber, drei, @react-three/postprocessing, Three.js, Framer Motion, React Router

**Backend:** Node.js, Express, MongoDB, Mongoose, Nodemailer, dotenv, cors

---

## Run locally

### Backend (runs on port 6060)
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, EMAIL_USER, EMAIL_PASS with real values
npm run dev
```

### Frontend (runs on port 3030)
```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL should point at your backend + /api
npm run dev
```

Both need to run at the same time in separate terminals for the site to work fully locally (contact form requires the backend).

---

## Environment variables

### `backend/.env`
```
PORT=6060
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3030
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_16_character_app_password
```
`EMAIL_PASS` must be a Gmail **App Password** (Google Account → Security → 2-Step Verification → App Passwords), not your regular Gmail password.

### `frontend/.env`
```
VITE_API_URL=http://localhost:6060/api
```

---

## Deployment

- **Frontend** deployed on [Vercel](https://vercel.com) — root directory `frontend`, includes a `vercel.json` rewrite rule so client-side routes (like the 404 page) work correctly.
- **Backend** deployed on [Render](https://render.com) — root directory `backend`, build command `npm install`, start command `npm start`.

When deploying, set the environment variables above in each platform's dashboard using real production values — `VITE_API_URL` on Vercel should point at the deployed Render backend, and `FRONTEND_URL` on Render should point at the deployed Vercel frontend, so CORS works both ways.

---

## Notes

- Render's free tier spins down after inactivity — the first request after idle time may take 30–60 seconds to respond while it wakes up.
- The `nodemailer` package currently has a known low-risk advisory flagged by `npm audit`; not yet resolved to avoid a breaking version bump, low priority for a personal project.
