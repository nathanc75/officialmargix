# MARGIX - AI-Powered Delivery Analytics

## Overview
MARGIX is an AI-powered delivery analytics platform for restaurants. It monitors Uber Eats, DoorDash, Grubhub, and other delivery platforms to detect pricing errors, missed refunds, and promotional losses to help recover lost revenue.

## Project Architecture
- **Frontend**: React 18 + TypeScript with Vite
- **UI Components**: Shadcn/ui with Radix primitives
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **State Management**: TanStack Query v5
- **Forms**: React Hook Form with Zod validation

## Directory Structure
```
src/
├── components/     # Reusable UI components
│   └── ui/         # Shadcn/ui components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── assets/         # Static assets
└── test/           # Test files

server/
└── index.js        # Express backend with Supabase admin client
```

## Development
- **Dev Server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Test**: `npm run test`

## Deployment
Configured as a static site deployment with build output in `dist/` directory.

## Recent Changes
- 2026-01-23: Added Supabase integration and Express backend
  - Installed @supabase/supabase-js for database/auth
  - Created server/index.js with Express and Supabase admin client
  - Added VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY secrets
- 2026-01-21: Imported from Lovable, configured for Replit environment
  - Updated Vite config to use port 5000 with allowedHosts
  - Configured static deployment
