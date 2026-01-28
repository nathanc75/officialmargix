
## Multi-AI Integration for MARGIX Upload Page

### Summary
Integrate four advanced AI capabilities into the uploads page: Document OCR & Extraction, Smart Categorization, Real-time Chat Assistant, and Enhanced Multi-Model Leak Detection. These features will use the existing Replit AI integrations (OpenAI and Gemini) that are already configured in your backend.

### What You'll Get

1. **Document OCR & Extraction** - AI automatically reads PDFs and images, extracting text, tables, and financial data
2. **Smart Categorization** - AI auto-detects document types (bank statement vs invoice vs receipt) and routes them correctly
3. **Real-time Chat Assistant** - A chat widget where users can ask questions about their uploaded documents and analysis results
4. **Enhanced Leak Detection** - Multiple AI models working together for deeper, cross-validated analysis

### User Experience Flow

```text
Upload Document
      │
      ▼
┌─────────────────────────────────────┐
│     AI Processing Pipeline           │
├─────────────────────────────────────┤
│ 1. OCR Extract (Gemini Vision)      │
│    ↓                                 │
│ 2. Smart Categorize (GPT-4o-mini)   │
│    ↓                                 │
│ 3. Multi-Model Analysis              │
│    • Gemini: Pattern Detection       │
│    • GPT: Deep Reasoning             │
│    • Combined: Cross-validation      │
└─────────────────────────────────────┘
      │
      ▼
Results Dashboard + Chat Assistant
```

---

### Technical Implementation

#### Part 1: Document OCR & Extraction

**New Backend Endpoint:** `POST /api/analyze/ocr`

Uses Gemini Vision to extract text and structured data from uploaded documents (PDFs, images). This processes files before the main leak analysis.

**File: `server/index.js`**
- Add new `/api/analyze/ocr` endpoint
- Accept base64 image/PDF data
- Use Gemini Vision to extract:
  - Raw text content
  - Tables as structured JSON
  - Key financial figures (amounts, dates, account numbers)

**File: `src/pages/Uploads.tsx`**
- Modify `handleFileSelect` to detect image/PDF files
- For PDFs/images: call OCR endpoint first before storing content
- Show "Extracting text..." status during OCR processing

---

#### Part 2: Smart Categorization

**New Backend Endpoint:** `POST /api/analyze/categorize`

AI automatically detects the document type from its content.

**File: `server/index.js`**
- Add `/api/analyze/categorize` endpoint
- Uses GPT-4o-mini to classify documents into:
  - `payment_report` - Stripe, PayPal, Square payouts
  - `bank_statement` - Bank transactions
  - `invoice` - Vendor invoices
  - `receipt` - Purchase receipts
  - `pricing_list` - Product/menu pricing
  - `refund_record` - Refund documentation
- Returns suggested category with confidence score

**File: `src/pages/Uploads.tsx`**
- Add "Auto-Detect" button in each upload section
- When files are uploaded to wrong section, suggest moving them
- Show detected category badge on each file
- Add option to bulk-categorize all files

---

#### Part 3: Real-time Chat Assistant

**New Component:** `src/components/AIChatWidget.tsx`

A floating chat widget for document Q&A.

**New Backend Endpoint:** `POST /api/chat/document`
- Streaming chat endpoint using GPT-4o-mini
- Context-aware: knows about uploaded documents and analysis results
- Can answer questions like:
  - "What's my largest recurring charge?"
  - "Explain this duplicate charge"
  - "How can I reduce my fees?"

**File: `src/pages/Uploads.tsx` & `src/pages/LeakResults.tsx`**
- Add floating chat button (bottom-right corner)
- Opens chat panel with message history
- Passes document context to AI

**Chat Widget Features:**
- Collapsible sidebar panel
- Message history during session
- Typing indicator during AI response
- Quick action suggestions

---

#### Part 4: Enhanced Multi-Model Leak Detection

**Updated Backend Endpoint:** `POST /api/analyze/leaks`

Uses multiple AI models for cross-validated, deeper analysis.

**File: `server/index.js`**
- Modify `/api/analyze/leaks` to use multi-model approach:

  **Step 1: Gemini Analysis**
  - Pattern detection and anomaly identification
  - Good at spotting visual patterns in data
  
  **Step 2: GPT Analysis**
  - Deep reasoning on financial implications
  - Better at contextual understanding
  
  **Step 3: Cross-Validation**
  - Compare findings from both models
  - Increase confidence for matched findings
  - Flag discrepancies for human review

**Enhanced Response Format:**
```json
{
  "totalLeaks": 5,
  "totalRecoverable": 847.50,
  "leaks": [...],
  "confidence": {
    "overallScore": 0.92,
    "crossValidated": 4,
    "needsReview": 1
  },
  "modelContributions": {
    "gemini": ["Pattern: duplicate $49.99 charges on 3rd of month"],
    "gpt": ["Context: Subscription likely double-billing"]
  }
}
```

---

### New Files to Create

| File | Purpose |
|------|---------|
| `src/components/AIChatWidget.tsx` | Floating chat assistant component |
| `src/components/DocumentPreview.tsx` | Shows OCR-extracted content preview |
| `src/hooks/useDocumentChat.ts` | Chat state management hook |

### Files to Modify

| File | Changes |
|------|---------|
| `server/index.js` | Add OCR, categorize, chat, and enhanced leak endpoints |
| `src/pages/Uploads.tsx` | Integrate OCR, categorization, and chat widget |
| `src/pages/LeakResults.tsx` | Add chat widget and confidence indicators |
| `src/context/AnalysisContext.tsx` | Add chat history and OCR state |

---

### UI Enhancements

1. **Upload Cards**
   - New "Auto-Detect Type" button
   - Category badge on each file
   - "Extracting..." progress for OCR

2. **Analysis Progress**
   - Multi-step progress indicator:
     - Step 1: Extracting text (OCR)
     - Step 2: Categorizing documents
     - Step 3: Gemini analysis
     - Step 4: GPT analysis
     - Step 5: Cross-validation

3. **Results Page**
   - Confidence score badge on each finding
   - "Verified by 2 models" indicator
   - Expandable "AI reasoning" section

4. **Chat Widget**
   - Floating button in bottom-right
   - Slide-out panel
   - Context-aware suggestions

---

### Considerations

- **Processing Time**: Multi-model analysis takes longer (~10-15 seconds vs ~5 seconds). The UI will show detailed progress steps to keep users informed.
- **File Types**: OCR works best with clear, readable documents. Handwritten or low-quality scans may have reduced accuracy.
- **Chat Context**: Chat assistant only knows about documents uploaded in the current session. Previous scans aren't included unless user re-uploads.
