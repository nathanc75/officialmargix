# LeakDetector - AI-Powered Business Leak Detection

## Overview
LeakDetector is a universal business leak detection platform. Users upload financial documents (bank statements, payment processor exports, invoices, PDFs/CSVs) without needing to connect any accounts. The AI scans for revenue leaks including missing payments, duplicate charges, unused subscriptions, failed payments, and pricing inefficiencies. Free initial scan with optional monthly subscription for ongoing monitoring.

## Project Architecture
- **Frontend**: React 18 + TypeScript with Vite
- **Backend**: Express.js server with AI integrations
- **UI Components**: Shadcn/ui with Radix primitives
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **State Management**: TanStack Query v5, AnalysisContext for leak analysis
- **Forms**: React Hook Form with Zod validation

## Directory Structure
```
src/
├── components/     # Reusable UI components
│   ├── ui/         # Shadcn/ui components
│   └── dashboard/  # Dashboard-specific components
├── pages/          # Page components
│   ├── Index.tsx   # Landing page
│   ├── Uploads.tsx # File upload page
│   ├── LeakResults.tsx # Analysis results page
│   └── Pricing.tsx # Pricing plans
├── context/        # React contexts
│   ├── AnalysisContext.tsx # Leak analysis state
│   └── UserContext.tsx     # User auth/plan state
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
└── assets/         # Static assets

server/
└── index.js        # Express backend with AI integrations
```

## Key Pages & Routes
- `/` - Landing page with value proposition
- `/upload` - File upload interface for financial documents
- `/results` - Leak analysis results display
- `/pricing` - Subscription plans
- `/signup`, `/signin` - Authentication pages

## Development
- **Dev Server**: `npm run dev` (runs on port 5000, backend on 3001)
- **Build**: `npm run build`
- **Test**: `npm run test`

## Deployment
Configured as autoscale deployment. Production uses port 5000 for the Express server.

## AI Integrations
The platform uses Replit AI Integrations (no API keys needed, billed to credits):
- **OpenAI (GPT-4o-mini)**: Analyzes financial documents to detect revenue leaks

API Endpoints:
- `POST /api/analyze/leaks` - Analyzes uploaded financial documents for revenue leaks
  - Request: `{ fileContent: string, fileNames: string[] }`
  - Response: `{ success: boolean, analysis: LeakAnalysis }`

## Leak Types Detected
1. Missing Payments - Expected income that never arrived
2. Duplicate Charges - Being charged twice for the same service
3. Unused Subscriptions - Subscriptions being paid but not used
4. Failed Payments - Transactions that failed but weren't retried
5. Pricing Inefficiencies - Being overcharged vs market rates
6. Billing Errors - Incorrect amounts, math errors

## Data Flow
1. User uploads financial documents on `/upload` page
2. Files are read as text and sent to `/api/analyze/leaks`
3. AI analyzes content and returns structured leak analysis
4. Results stored in AnalysisContext and displayed on `/results` page

## Business Model
- **Free Scan**: One-time leak analysis (no account needed)
- **Monthly Subscription**: Ongoing monitoring for new leaks

## Recent Changes
- 2026-01-27: Rebranded from MARGIX restaurant analytics to LeakDetector universal platform
  - Updated all landing page components for leak detection messaging
  - Created new `/upload` page for financial document uploads
  - Created `/results` page for displaying leak analysis
  - Added `/api/analyze/leaks` endpoint for universal leak detection
  - Extended AnalysisContext with LeakAnalysis type and setLeakAnalysis method
  - Updated navigation flow: Landing → Upload → Results → Pricing
- 2026-01-26: Previous restaurant-focused features (see git history)
