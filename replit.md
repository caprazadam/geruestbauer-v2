# Gerüstbauer24 (Scaffolding Company Directory)

## Overview
A Next.js web application for finding reliable scaffolding companies in Germany. Users can search for scaffolding contractors by location and service type.

**Site URL:** https://geruestbauer24.eu

## Project Architecture
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks
- **Email**: Resend integration for OTP verification

## Project Structure
```
├── app/               # Next.js app router pages and layouts
├── components/        # React components (UI and feature components)
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and data
├── public/            # Static assets
├── styles/            # Global styles
```

## Key Features
- Company directory with search and filtering
- Blog system with admin management
- Admin panel with dashboard, companies, users, reviews, blog management
- Email OTP authentication via Resend
- SEO optimization with sitemap and robots.txt
- Dynamic SEO settings from admin panel

## Development
- **Dev Server**: Runs on port 5000 with `npm run dev -- -H 0.0.0.0 -p 5000`
- **Build**: `npm run build`
- **Production**: `npm run start -- -H 0.0.0.0 -p 5000`

## Admin Access
- Default credentials: admin / admin123
- Password can be changed in /admin/settings

## Recent Changes
- January 30, 2026: Fixed admin settings and password change functionality
- January 30, 2026: Added blog pages and admin blog management
- January 30, 2026: Fixed domain to geruestbauer24.eu across all files
- January 16, 2026: Initial import and Replit environment setup

## User Preferences
- Site domain: geruestbauer24.eu
- All content must be in German
- Deploy target: Vercel
