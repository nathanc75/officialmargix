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

## AI Integrations
The platform uses Replit AI Integrations (no API keys needed, billed to credits):
- **OpenAI (GPT-4o-mini)**: Analyzes delivery reports to extract financial data, detect pricing errors
- **Gemini (2.5-flash)**: Vision model to read menu screenshots and extract item prices

API Endpoints:
- `POST /api/analyze/report` - Analyze delivery report content with OpenAI
- `POST /api/analyze/menu` - Extract menu items/prices from images with Gemini Vision
- `POST /api/analyze/compare` - Compare report data with menu prices to find discrepancies

All AI-generated values are marked as estimates (~) for transparency.

## Recent Changes
- 2026-01-26: Added AI-powered analysis using Replit AI Integrations
  - Integrated OpenAI (GPT-4o-mini) for delivery report analysis
  - Integrated Gemini (2.5-flash) for menu image reading with vision
  - Added AI analysis endpoints in server/index.js
  - Updated Uploads.tsx to trigger AI analysis after file upload
  - Shows analysis progress with animated UI feedback
- 2026-01-23: Added Supabase integration and Express backend
  - Installed @supabase/supabase-js for database/auth
  - Created server/index.js with Express and Supabase admin client
  - Added VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY secrets
- 2026-01-21: Imported from Lovable, configured for Replit environment
  - Updated Vite config to use port 5000 with allowedHosts
  - Configured static deployment
