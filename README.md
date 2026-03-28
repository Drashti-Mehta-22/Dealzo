# 🛍️ Dealzo — Product Price Tracker

> Track prices. Save money. Never overpay again.

Dealzo monitors product prices from any e-commerce site and instantly alerts you when the price drops. Paste a URL, and DealDrop takes care of the rest — scraping, storing, and notifying.

---

## ✨ Features

- 🔐 **Google Sign-In** — Secure authentication with Google OAuth via Supabase
- 🤖 **AI-Powered Scraping** — Firecrawl extracts product name, price, currency, and image from any URL
- 📊 **Price History Charts** — Interactive graphs showing price trends over time
- 🔄 **Automated Price Checks** — Daily scheduled jobs re-scrape all tracked products automatically
- 📧 **Email Alerts** — Clean, minimal email notifications when a price drops — showing old price, new price, and savings

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Google OAuth |
| Scraping | Firecrawl |
| Email | Resend |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| Charts | Recharts |

---

## 🔍 How It Works

```
User pastes a product URL
        ↓
Firecrawl scrapes name, price, currency & image
        ↓
Product saved to Supabase with initial price
        ↓
Daily job re-scrapes all tracked products
        ↓
Price changed? → Update DB + record in price history
        ↓
Price dropped? → Send email alert via Resend
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [Supabase](https://supabase.com) account
- [Firecrawl](https://firecrawl.dev) account
- [Resend](https://resend.com) account
- Google Cloud Console project with OAuth 2.0 credentials

## 🔒 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Firecrawl
FIRECRAWL_API_KEY=your_firecrawl_api_key

# Resend
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev

# Security
CRON_SECRET=your_generated_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate a secure `CRON_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
---

## ⚙️ Service Setup

### Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Run the database migrations in the SQL editor to set up `product` and `price_history` tables with Row Level Security
3. Enable **Google** under Authentication → Providers
4. Add your Google OAuth credentials from Google Cloud Console
5. Set the redirect URI to your Supabase callback URL

### Firecrawl
1. Sign up at [firecrawl.dev](https://firecrawl.dev)
2. Copy your API key into `FIRECRAWL_API_KEY`

### Resend
1. Sign up at [resend.com](https://resend.com)
2. Copy your API key into `RESEND_API_KEY`
3. Use `onboarding@resend.dev` for testing — no domain needed

---

## 📦 Deployment

1. Push your code to GitHub and import the repo into [Vercel](https://vercel.com)
2. Add all environment variables in Vercel project settings
3. Set `NEXT_PUBLIC_APP_URL` to your production Vercel URL
4. Update the Google OAuth redirect URI with your production domain
5. Update Supabase allowed redirect URLs with your production URL

---

## ⚠️ Known Limitations

- Sites with aggressive anti-bot protection (Amazon, Zara) may cause occasional scraping timeouts
- Resend free tier only allows sending to your own registered email without a verified custom domain

---
