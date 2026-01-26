# MARGIX - AI-Powered Restaurant Analytics

## Overview
MARGIX is an AI-powered restaurant analytics platform. It securely connects to a restaurant's POS system to analyze real order data across dine-in, takeout, and delivery channels. The AI provides feedback, performance analysis, and actionable suggestions to help improve sales, efficiency, and profitability.

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

API Endpoints:
- `POST /api/analyze/report` - Analyze delivery report content with OpenAI

All AI-generated values are marked as estimates (~) for transparency.

## User Plan Tiers
The platform supports three user tiers managed via UserContext (src/context/UserContext.tsx):
- **Free Trial**: Can upload reports for analysis, but POS connections are locked
- **Starter Plan**: Can connect up to 2 POS/delivery platforms
- **Pro Plan**: Unlimited POS/delivery platform connections

## Sign-In Flow
- **Sign In** → Goes to Dashboard as Pro user (paid experience with full POS access)
- **Create Account** → Goes to Dashboard as Free Trial (demo mode, can upload reports but POS connections locked)
- Dashboard shows "Get Started" card with options to Connect POS or Upload Reports

The UploadsAndPOS page (/uploads-pos) shows different UI based on user's plan:
- Free trial users see locked platforms with "Upgrade to Connect" buttons
- Starter users can connect 2 platforms, then see limit reached messaging
- Pro users can connect unlimited platforms

## Recent Changes
- 2026-01-26: Updated sign-in flow to go to dashboard first
  - Sign In now navigates to /dashboard as Pro user
  - Create Account navigates to /dashboard as Free Trial
  - Dashboard shows "Get Started" card with Connect POS and Upload Reports buttons
- 2026-01-26: Implemented plan-based POS connection limits
  - Created UserContext (src/context/UserContext.tsx) with auth state, plan tier, and connected platforms tracking
  - UploadsAndPOS page shows different UI based on user's plan tier:
    - Header badge shows plan tier (Free Trial, Starter Plan, Pro Plan)
    - Starter users see connection count (e.g., "1/2 Connected")
    - Pro users see "Unlimited Connections" badge
    - Messaging and buttons adapt to plan tier and connection limits
  - Connect/Disconnect functionality with toast notifications
- 2026-01-26: Simplified upload pages and added Clover POS
  - Removed menu screenshot upload from both Uploads.tsx and UploadsAndPOS.tsx pages
  - Now users only upload delivery reports for analysis (simpler flow)
  - Added Clover as a POS option in both upload pages
  - Updated page headers and messaging to reflect reports-only upload
- 2026-01-26: Comprehensive messaging update from delivery-focused to POS-focused platform
  - Updated all landing page components (HeroSection, FeaturesSection, HowItWorksSection, WhyDifferentSection, FAQSection, BookDemoSection, AnimatedDashboard, Footer) with POS-integration messaging
  - Updated user flow pages (Signup, SignIn, Pricing, PricingSection) to emphasize POS connection
  - Updated dashboard components (AnalysisBanner, InsightsSection, ProfitOverview, InsightsAnalysisTabs, ItemBreakdownTable) with "Connect POS" CTAs
  - Updated SEO meta descriptions in index.html
  - All messaging now emphasizes multi-channel analytics (dine-in, takeout, delivery) powered by POS connection
  - Upload functionality remains as fallback option for trial users
- 2026-01-26: Implemented end-to-end AI analysis data flow
  - Created AnalysisContext (src/context/AnalysisContext.tsx) for global state management of AI analysis results
  - Updated UploadsAndPOS page to read file content and trigger AI analysis with error handling via toast notifications
  - Updated Trial Dashboard and its components to display real AI analysis data:
    - AnalysisBanner: Shows analysis status, recoverable amount from issues
    - InsightsSection: Displays issues with severity and potential recovery amounts
    - ProfitOverview: Shows revenue, fees, promos, and net profit from analysis
    - ItemBreakdownTable: Lists analyzed menu items with profit/loss indicators
    - InsightsAnalysisTabs: Shows promo issues and AI recommendations
  - All components properly handle empty states and display estimated values with ~ indicator
- 2026-01-26: Added AI-powered analysis using Replit AI Integrations
  - Integrated OpenAI (GPT-4o-mini) for text-based delivery report analysis
  - Integrated Gemini (2.5-flash) for image/screenshot reading with vision
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
