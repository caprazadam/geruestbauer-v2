# Gerüstbauer-Verzeichnis (Scaffolding Company Directory)

## Overview
A Next.js web application for finding reliable scaffolding companies in Germany. Users can search for scaffolding contractors by location and service type.

## Project Architecture
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks

## Project Structure
```
├── app/               # Next.js app router pages and layouts
├── components/        # React components (UI and feature components)
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and data
├── public/            # Static assets
├── styles/            # Global styles
```

## Development
- **Dev Server**: Runs on port 5000 with `npm run dev -- -H 0.0.0.0 -p 5000`
- **Build**: `npm run build`
- **Production**: `npm run start -- -H 0.0.0.0 -p 5000`

## Recent Changes
- January 16, 2026: Initial import and Replit environment setup
  - Configured Next.js to allow Replit dev origins
  - Set up workflow for development server on port 5000
  - Configured deployment for autoscaling

## User Preferences
(No preferences recorded yet)
