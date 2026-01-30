// Universal Business Data Extraction Types

export type FileKind = 
  | "pos_item_level" 
  | "pos_summary" 
  | "delivery_statement" 
  | "bank_statement" 
  | "expense_ledger" 
  | "invoice_receipt_export" 
  | "custom_spreadsheet" 
  | "menu_image_text" 
  | "unknown";

export type DataGrain = "item_level" | "summary_only" | "transaction_level";

export type ExpenseType = 
  | "cogs" 
  | "labor" 
  | "occupancy" 
  | "marketing" 
  | "utilities" 
  | "supplies" 
  | "software" 
  | "shipping" 
  | "taxes_fees" 
  | "payment_processing" 
  | "platform_fees" 
  | "other";

export interface Period {
  start: string | null;
  end: string | null;
}

export interface SalesSummary {
  gross_sales: number | null;
  net_sales: number | null;
  taxes_collected: number | null;
  tips_collected: number | null;
  discounts_total: number | null;
  promotions_total: number | null;
  refunds_total: number | null;
  chargebacks_total: number | null;
  fees_total: number | null;
  net_payout: number | null;
  order_count: number | null;
}

export interface ExtractedItem {
  item_name: string;
  sku?: string;
  category?: string;
  quantity: number;
  gross_item_sales: number;
  discounts_item?: number;
  net_item_sales?: number;
  item_tax?: number;
  modifiers?: string[];
}

export interface ExtractedExpense {
  date: string;
  vendor_or_payee: string;
  description: string;
  amount: number;
  expense_category: string;
  expense_type: ExpenseType;
  confidence: number;
}

export interface ExtractionConfidence {
  sales_summary: Record<string, number>;
  items: Record<string, number>;
  expenses: Record<string, number>;
}

export interface ExtractionValidation {
  math_check_passed: boolean | null;
  notes: string;
}

export interface UniversalExtraction {
  file_kind: FileKind;
  classification_confidence: number;
  grain: DataGrain;
  period: Period;
  needs_user_mapping: boolean;
  mapping_suggestions: Record<string, string>;
  sales_summary: SalesSummary;
  items: ExtractedItem[];
  expenses: ExtractedExpense[];
  confidence: ExtractionConfidence;
  validation: ExtractionValidation;
  notes_for_user: string;
}

export interface ExtractionResult {
  success: boolean;
  extraction: UniversalExtraction;
  fileName: string;
  model: string;
  processedAt: string;
  error?: string;
}

// Helper to get human-readable file kind label
export function getFileKindLabel(kind: FileKind): string {
  const labels: Record<FileKind, string> = {
    pos_item_level: "POS Item-Level Export",
    pos_summary: "POS Summary Report",
    delivery_statement: "Delivery Platform Statement",
    bank_statement: "Bank Statement",
    expense_ledger: "Expense Ledger",
    invoice_receipt_export: "Invoice/Receipt Export",
    custom_spreadsheet: "Custom Spreadsheet",
    menu_image_text: "Menu/Price List",
    unknown: "Unknown Document",
  };
  return labels[kind] || "Unknown";
}

// Helper to get expense type label
export function getExpenseTypeLabel(type: ExpenseType): string {
  const labels: Record<ExpenseType, string> = {
    cogs: "Cost of Goods Sold",
    labor: "Labor & Wages",
    occupancy: "Rent & Occupancy",
    marketing: "Marketing & Advertising",
    utilities: "Utilities",
    supplies: "Supplies",
    software: "Software & SaaS",
    shipping: "Shipping & Delivery",
    taxes_fees: "Taxes & Fees",
    payment_processing: "Payment Processing",
    platform_fees: "Platform Fees",
    other: "Other",
  };
  return labels[type] || type;
}

// Helper to check if extraction has meaningful sales data
export function hasSalesData(extraction: UniversalExtraction): boolean {
  const s = extraction.sales_summary;
  return !!(s.gross_sales || s.net_sales || s.net_payout || extraction.items.length > 0);
}

// Helper to check if extraction has expense data
export function hasExpenseData(extraction: UniversalExtraction): boolean {
  return extraction.expenses.length > 0;
}

// Calculate total from sales summary
export function calculateSummaryTotal(summary: SalesSummary): number {
  return (summary.gross_sales || 0) - 
         (summary.fees_total || 0) - 
         (summary.promotions_total || 0) - 
         (summary.refunds_total || 0) -
         (summary.chargebacks_total || 0);
}
