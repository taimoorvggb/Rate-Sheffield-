# 🛡️ RateShield AI — Deployment Guide

Freight broker profit protection platform with Supabase backend, Claude AI, and full authentication.

---

## 📋 What's Included

- **Authentication** — Sign up, log in, password reset (Supabase Auth)
- **Loads** — Add/delete loads, real-time profit & risk analysis
- **Invoices** — Track pending/paid/overdue invoices with auto-overdue detection
- **Cash Flow Radar** — 8-week cash position forecast based on your real data
- **Reports** — Full load performance breakdown
- **AI Advisor** — Claude-powered freight analysis (requires Anthropic API key)
- **Settings** — Account info and environment variable guide

---

## 🚀 Step-by-Step Deployment

### Step 1 — Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Click **New Project** → give it a name (e.g. `rateshield`) → set a strong DB password → Create
3. Wait ~2 minutes for the project to be ready
4. Go to **Project Settings → API** and copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public key** (long JWT string)

### Step 2 — Run the Database Schema

1. In your Supabase project, go to **SQL Editor → New Query**
2. Open the file `supabase_schema.sql` from this project
3. Paste the entire contents and click **Run**
4. You should see: `Success. No rows returned`

### Step 3 — Enable Email Auth

1. In Supabase go to **Authentication → Providers**
2. Make sure **Email** is enabled (it is by default)
3. Optional: Go to **Authentication → Email Templates** to customize confirmation emails

### Step 4 — Get Your Anthropic API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Create an account or log in
3. Go to **API Keys → Create Key**
4. Copy the key (starts with `sk-ant-...`)

### Step 5 — Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
VITE_ANTHROPIC_API_KEY=sk-ant-...your-anthropic-key
```

### Step 6 — Test Locally (Optional)

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## ☁️ Deploy to Vercel

### Option A — Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option B — Deploy via GitHub (Recommended)

1. Push this project to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/rateshield-ai.git
   git push -u origin main
   ```

2. Go to [https://vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo

3. In Vercel project settings, go to **Settings → Environment Variables** and add:

   | Key | Value |
   |-----|-------|
   | `VITE_SUPABASE_URL` | Your Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `VITE_ANTHROPIC_API_KEY` | Your Anthropic API key |

4. Click **Deploy** — your app will be live in ~60 seconds

### Step 7 — Update Supabase Auth Redirect URL

After deploying, copy your Vercel URL (e.g. `https://rateshield-ai.vercel.app`):

1. In Supabase → **Authentication → URL Configuration**
2. Set **Site URL** to your Vercel URL
3. Add to **Redirect URLs**: `https://your-app.vercel.app/**`

---

## 📁 Project Structure

```
rateshield/
├── src/
│   ├── components/
│   │   ├── AuthPage.jsx      ← Login / Signup / Reset password
│   │   └── Dashboard.jsx     ← Full app with all views
│   ├── lib/
│   │   └── supabase.js       ← Supabase client
│   ├── App.jsx               ← Auth router
│   └── main.jsx              ← Entry point
├── public/
│   └── shield.svg            ← Favicon
├── supabase_schema.sql       ← Run this in Supabase SQL editor
├── .env.example              ← Copy to .env and fill in your keys
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## ⚠️ Security Notes

- **Never commit your `.env` file** — it's in `.gitignore`
- The Supabase anon key is safe to expose (it's designed for browser use)
- The Anthropic API key is used client-side — for production, consider wrapping it in a Vercel Edge Function or Supabase Edge Function to keep it server-side
- Row Level Security (RLS) is enabled — users can only access their own data

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Auth & Database | Supabase (PostgreSQL + Auth) |
| AI | Anthropic Claude (claude-sonnet-4-20250514) |
| Hosting | Vercel |
| Styling | Inline CSS (no dependencies) |
