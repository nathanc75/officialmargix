import { useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload, CheckCircle2, Plus, Loader2, Search, Sparkles, AlertCircle, File, Trash2, CreditCard, ListOrdered, Lock, Building2, Receipt, ReceiptText, ArrowRight, Wand2, Brain, Database } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { useAnalysis, LeakAnalysis } from "@/context/AnalysisContext";
import { useToast } from "@/hooks/use-toast";
import { AIChatWidget } from "@/components/AIChatWidget";
import { DocumentPreview, OCRResult } from "@/components/DocumentPreview";
import { AnalysisProgress, AnalysisStep } from "@/components/AnalysisProgress";
import { supabase } from "@/integrations/supabase/client";
import type { UniversalExtraction } from "@/types/extraction";
import { getFileKindLabel } from "@/types/extraction";

type DocumentCategory = "payments" | "pricing" | "bank" | "invoices" | "refunds" | "promos";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: DocumentCategory;
  status: "uploading" | "uploaded" | "extracting" | "categorizing" | "analyzing" | "analyzed" | "error";
  content?: string;
  ocrResult?: OCRResult;
  detectedCategory?: string;
  categoryConfidence?: number;
  base64Data?: string;
  extraction?: UniversalExtraction;
}

interface UploadSectionConfig {
  id: DocumentCategory;
  title: string;
  description: string;
  icon: React.ReactNode;
  accept: string;
  placeholder: string;
  locked?: boolean;
  optional?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isImageOrPdf = (file: File): boolean => {
  return file.type.startsWith("image/") || file.type === "application/pdf";
};

const isSpreadsheetOrDoc = (file: File): boolean => {
  const spreadsheetTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "application/csv",
  ];
  const docTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const fileName = file.name.toLowerCase();
  return spreadsheetTypes.includes(file.type) || 
         docTypes.includes(file.type) ||
         fileName.endsWith(".csv") ||
         fileName.endsWith(".xlsx") ||
         fileName.endsWith(".xls") ||
         fileName.endsWith(".doc") ||
         fileName.endsWith(".docx");
};

const Uploads = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep | null>(null);
  const paymentsInputRef = useRef<HTMLInputElement>(null);
  const pricingInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setLeakAnalysis, setExtractions, leakAnalysis } = useAnalysis();
  const { toast } = useToast();

  // Free scan sections - payment reports + optional pricing
  const freeSections: UploadSectionConfig[] = [
    {
      id: "payments",
      title: "Payment or Payout Report",
      description: "Upload your payment processor or payout report",
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      accept: ".csv,.pdf,.txt,.tsv,.xlsx,.jpg,.jpeg,.png,.webp,.gif,.heic",
      placeholder: "Stripe, PayPal, Square, DoorDash, Uber Eats payouts",
    },
    {
      id: "pricing",
      title: "What you charge",
      description: "Helps detect pricing gaps and undercharging",
      icon: <ListOrdered className="h-5 w-5 text-emerald-500" />,
      accept: ".csv,.pdf,.txt,.xlsx,.jpg,.jpeg,.png,.webp,.gif,.heic,.bmp,.tiff",
      placeholder: "Menu screenshots, product photos, price lists",
      optional: true,
    },
  ];

  // Premium sections - locked for free users
  const premiumSections: UploadSectionConfig[] = [
    {
      id: "bank",
      title: "Bank Statements",
      description: "Cross-reference with bank transactions",
      icon: <Building2 className="h-5 w-5 text-muted-foreground" />,
      accept: ".csv,.pdf,.txt",
      placeholder: "Bank exports for deeper analysis",
      locked: true,
    },
    {
      id: "invoices",
      title: "Invoices & Receipts",
      description: "Match invoices against payments",
      icon: <Receipt className="h-5 w-5 text-muted-foreground" />,
      accept: ".csv,.pdf,.txt",
      placeholder: "Vendor invoices, purchase receipts",
      locked: true,
    },
    {
      id: "refunds",
      title: "Refund Records",
      description: "Track refunds and chargebacks",
      icon: <ReceiptText className="h-5 w-5 text-muted-foreground" />,
      accept: ".csv,.pdf,.txt",
      placeholder: "Refund reports, chargeback data",
      locked: true,
    },
  ];

  const allSections = [...freeSections, ...premiumSections];

  const getInputRef = (category: DocumentCategory) => {
    switch (category) {
      case "payments": return paymentsInputRef;
      case "pricing": return pricingInputRef;
      default: return null;
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Remove the data URL prefix to get just the base64 data
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // OCR extraction for images/PDFs, or text extraction for spreadsheets/docs
  const performOCR = useCallback(async (fileId: string, base64Data: string | null, mimeType: string, fileName: string, textContent?: string) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: "extracting" as const } : f
    ));

    try {
      const { data, error } = await supabase.functions.invoke("analyze-ocr", {
        body: {
          imageBase64: base64Data,
          imageMimeType: mimeType,
          fileName,
          textContent, // For spreadsheets/docs, send text content instead
        },
      });

      if (error) throw new Error(error.message || "OCR failed");
      
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          ocrResult: data.ocrResult,
          content: data.ocrResult.rawText,
          status: "uploaded" as const 
        } : f
      ));

      return data.ocrResult;
    } catch (error) {
      console.error("OCR error:", error);
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: "error" as const } : f
      ));
      return null;
    }
  }, []);

  // Universal extraction - replaces old categorization
  const performExtraction = useCallback(async (fileId: string, content: string, fileName: string, fileType?: string) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: "categorizing" as const } : f
    ));

    try {
      const { data, error } = await supabase.functions.invoke("analyze-extract", {
        body: { textContent: content, fileName, fileType },
      });

      if (error) throw new Error(error.message || "Extraction failed");
      
      const extraction = data.extraction as UniversalExtraction;
      
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          extraction,
          detectedCategory: extraction.file_kind,
          categoryConfidence: extraction.classification_confidence,
          status: "uploaded" as const 
        } : f
      ));

      return extraction;
    } catch (error) {
      console.error("Extraction error:", error);
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: "uploaded" as const } : f
      ));
      return null;
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, category: DocumentCategory) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `file-${Date.now()}-${i}`;
      
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type || (file.name.endsWith('.csv') ? 'text/csv' : 'application/pdf'),
        category,
        status: "uploading",
      };
      
      newFiles.push(uploadedFile);
    }
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Process files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = newFiles[i].id;
      
      try {
        if (isSpreadsheetOrDoc(file)) {
          // For Excel/Word files, read as text and use AI extraction
          const textContent = await readFileContent(file);
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, content: textContent } : f
          ));
          // Send text content to the OCR function for AI processing
          await performOCR(fileId, null, file.type, file.name, textContent);
        } else if (isImageOrPdf(file)) {
          // For images and PDFs, use OCR with vision
          const base64Data = await readFileAsBase64(file);
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, base64Data } : f
          ));
          await performOCR(fileId, base64Data, file.type, file.name);
        } else {
          // For plain text files (.txt, .tsv), read directly
          const content = await readFileContent(file);
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, status: "uploaded" as const, content } : f
          ));
        }
      } catch {
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: "error" as const } : f
        ));
      }
    }
    
    // Reset input
    const inputRef = getInputRef(category);
    if (inputRef?.current) {
      inputRef.current.value = "";
    }
  };

  const handleAutoDetect = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file || !file.content) return;

    toast({
      title: "Extracting & Classifying",
      description: "AI is analyzing your document...",
    });

    const result = await performExtraction(fileId, file.content, file.name, file.type);
    
    if (result) {
      toast({
        title: "Extraction Complete",
        description: `Detected as ${getFileKindLabel(result.file_kind)} (${Math.round(result.classification_confidence * 100)}% confidence)`,
      });
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFilesForCategory = (category: DocumentCategory) => {
    return uploadedFiles.filter(f => f.category === category);
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      // Step 1: OCR for any remaining files
      setAnalysisStep("ocr");
      const filesNeedingOCR = uploadedFiles.filter(f => f.base64Data && !f.ocrResult);
      for (const file of filesNeedingOCR) {
        if (file.base64Data) {
          await performOCR(file.id, file.base64Data, file.type, file.name);
        }
      }

      // Step 2: Universal extraction for files without extraction
      setAnalysisStep("categorize");
      const filesNeedingExtraction = uploadedFiles.filter(f => f.content && !f.extraction);
      for (const file of filesNeedingExtraction) {
        if (file.content) {
          await performExtraction(file.id, file.content, file.name, file.type);
        }
      }
      
      // Store all extractions in context
      const allExtractions = uploadedFiles
        .map(f => f.extraction)
        .filter((e): e is UniversalExtraction => !!e);
      setExtractions(allExtractions);
      
      // Update all files to analyzing status
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: "analyzing" as const })));
      
      // Step 3: Gemini Analysis
      setAnalysisStep("gemini_analysis");
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause for UI update

      // Step 4: GPT Analysis  
      setAnalysisStep("gpt_analysis");
      
      // Combine all file contents for analysis
      const categorizedContent = freeSections.map(section => {
        const files = getFilesForCategory(section.id);
        if (files.length === 0) return "";
        return `=== ${section.title.toUpperCase()} ===\n${files.filter(f => f.content).map(f => `--- ${f.name} ---\n${f.content}`).join("\n\n")}`;
      }).filter(Boolean).join("\n\n");
      
      const { data: leakData, error: leakError } = await supabase.functions.invoke("analyze-leaks", {
        body: { 
          fileContent: categorizedContent,
          fileNames: uploadedFiles.map(f => f.name),
          categories: {
            payments: getFilesForCategory("payments").map(f => f.name),
          },
          ocrResults: uploadedFiles.filter(f => f.ocrResult).map(f => ({
            fileName: f.name,
            ocrResult: f.ocrResult,
          })),
          scanType: "free",
        },
      });
      
      if (leakError) {
        throw new Error(leakError.message || "Analysis failed");
      }
      
      // Step 5: Cross-validation
      setAnalysisStep("cross_validation");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = leakData;
      
      // Complete
      setAnalysisStep("complete");
      
      // Update files to analyzed status
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: "analyzed" as const })));
      
      // Store result in context and navigate
      setLeakAnalysis(result.analysis as LeakAnalysis);
      
      setTimeout(() => {
        navigate("/results");
      }, 1000);
      
    } catch (error) {
      console.error("Analysis failed:", error);
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: "error" as const })));
      setIsAnalyzing(false);
      setAnalysisStep(null);
      toast({
        title: "Analysis Failed",
        description: "We couldn't analyze your files. Please try again or upload different files.",
        variant: "destructive",
      });
    }
  };

  const totalFiles = uploadedFiles.length;
  const uploadedCount = uploadedFiles.filter(f => f.status === "uploaded" || f.status === "analyzed").length;
  const hasFiles = totalFiles > 0;
  const allUploaded = uploadedFiles.every(f => ["uploaded", "analyzed"].includes(f.status));

  const getCategoryStats = () => {
    return freeSections.map(section => ({
      ...section,
      count: getFilesForCategory(section.id).length,
    }));
  };

  // Chat widget context
  const chatContext = {
    fileNames: uploadedFiles.map(f => f.name),
    categories: {
      payments: getFilesForCategory("payments").map(f => f.name),
    },
    analysisResults: leakAnalysis ? {
      totalLeaks: leakAnalysis.totalLeaks,
      totalRecoverable: leakAnalysis.totalRecoverable,
      summary: leakAnalysis.summary,
    } : undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Abstract Background Elements - matching landing page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative">
        {/* Header Card */}
        <section className="pt-28 pb-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                  Find your missed revenue
                </h1>
                <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
                  Upload your documents and we'll scan for revenue leaks like failed payments and pricing gaps. Results in minutes.
                </p>
              </div>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted border border-border/50">
                  <Search className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Leak detection</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted border border-border/50">
                  <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">AI-powered extraction</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted border border-border/50">
                  <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Verified results</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">

          {/* Analysis Progress (shown during analysis) */}
          {isAnalyzing && analysisStep && (
            <AnalysisProgress currentStep={analysisStep} />
          )}

          {/* File Count Indicator */}
          {hasFiles && !isAnalyzing && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted border border-border/50">
              <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center border border-border/50">
                <CreditCard className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ready for analysis</p>
                <p className="text-sm font-medium text-foreground">
                  {totalFiles} {totalFiles === 1 ? "file" : "files"} uploaded
                </p>
              </div>
            </div>
          )}

          {/* Free Upload Sections */}
          {!isAnalyzing && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-medium text-foreground mb-1">
                  Upload your documents
                </h2>
                <p className="text-sm text-muted-foreground">
                  These files help us detect hidden revenue leaks in your business.
                </p>
              </div>
              <div className="grid gap-4">
                {freeSections.map((section) => {
                  const inputRef = getInputRef(section.id);
                  const categoryFiles = getFilesForCategory(section.id);
                  const categoryFileCount = categoryFiles.length;
                  
                  return (
                    <Card 
                      key={section.id}
                      className="transition-shadow hover:shadow-soft-md"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                              {section.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
                                {section.optional && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                                    Optional
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{section.description}</p>
                            </div>
                          </div>
                          {categoryFileCount > 0 && (
                            <Badge variant="default">
                              {categoryFileCount} {categoryFileCount === 1 ? 'file' : 'files'}
                            </Badge>
                          )}
                        </div>
                        
                        <div 
                          className="border border-dashed border-border rounded-lg p-6 text-center hover:border-muted-foreground/30 hover:bg-muted/50 transition-all cursor-pointer group"
                          onClick={() => inputRef?.current?.click()}
                        >
                          <input
                            ref={inputRef}
                            type="file"
                            accept={section.accept}
                            multiple
                            onChange={(e) => handleFileSelect(e, section.id)}
                            className="hidden"
                            data-testid={`input-file-upload-${section.id}`}
                          />
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mx-auto mb-3 group-hover:bg-muted/80 transition-colors">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <p className="text-base font-medium text-foreground mb-1">
                            Drop files here or click to upload
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">
                            {section.placeholder}
                          </p>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="gap-1.5" 
                            onClick={(e) => { e.stopPropagation(); inputRef?.current?.click(); }}
                            data-testid={`button-browse-${section.id}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Select Files
                          </Button>
                        </div>

                        {/* Uploaded Files List for this category */}
                        {categoryFileCount > 0 && (
                          <div className="mt-4 space-y-2">
                            {categoryFiles.map((file) => (
                              <div key={file.id}>
                                <div 
                                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                                    file.status === "error" 
                                      ? "bg-destructive/5 border-destructive/20" 
                                      : file.status === "extracting" || file.status === "categorizing"
                                        ? "bg-amber-500/5 border-amber-500/20"
                                        : file.status === "analyzing"
                                          ? "bg-primary/5 border-primary/20"
                                          : "bg-secondary/50 border-border"
                                  }`}
                                >
                                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                    file.status === "error" 
                                      ? "bg-destructive/10" 
                                      : file.status === "extracting" || file.status === "categorizing"
                                        ? "bg-amber-500/10"
                                        : file.status === "analyzing"
                                          ? "bg-primary/10"
                                          : "bg-secondary"
                                  }`}>
                                    {file.status === "uploading" || file.status === "analyzing" || file.status === "extracting" || file.status === "categorizing" ? (
                                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                                    ) : file.status === "error" ? (
                                      <AlertCircle className="h-4 w-4 text-destructive" />
                                    ) : file.status === "analyzed" ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <File className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                                      {file.extraction && (
                                        <Badge variant="outline" className="text-xs">
                                          {getFileKindLabel(file.extraction.file_kind)}
                                          {` ${Math.round(file.extraction.classification_confidence * 100)}%`}
                                        </Badge>
                                      )}
                                      {file.extraction && (
                                        <Badge variant="secondary" className="text-xs gap-1">
                                          <Database className="h-3 w-3" />
                                          Extracted
                                        </Badge>
                                      )}
                                      {file.ocrResult && !file.extraction && (
                                        <Badge variant="secondary" className="text-xs gap-1">
                                          <Wand2 className="h-3 w-3" />
                                          OCR
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {formatFileSize(file.size)} - {
                                        file.status === "uploading" ? "Uploading..." :
                                        file.status === "extracting" ? "Extracting text..." :
                                        file.status === "categorizing" ? "Extracting data..." :
                                        file.status === "analyzing" ? "Analyzing..." :
                                        file.status === "analyzed" ? "Analyzed" :
                                        file.status === "error" ? "Error" : "Ready"
                                      }
                                    </p>
                                    {/* Show extraction summary */}
                                    {file.extraction && file.extraction.sales_summary.gross_sales !== null && (
                                      <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                                        {file.extraction.sales_summary.gross_sales !== null && (
                                          <span className="text-muted-foreground">
                                            Sales: <span className="text-foreground font-medium">${file.extraction.sales_summary.gross_sales.toLocaleString()}</span>
                                          </span>
                                        )}
                                        {file.extraction.sales_summary.fees_total !== null && file.extraction.sales_summary.fees_total > 0 && (
                                          <span className="text-muted-foreground">
                                            Fees: <span className="text-amber-600 font-medium">${file.extraction.sales_summary.fees_total.toLocaleString()}</span>
                                          </span>
                                        )}
                                        {file.extraction.sales_summary.net_payout !== null && (
                                          <span className="text-muted-foreground">
                                            Net: <span className="text-green-600 font-medium">${file.extraction.sales_summary.net_payout.toLocaleString()}</span>
                                          </span>
                                        )}
                                        {file.extraction.items.length > 0 && (
                                          <span className="text-muted-foreground">
                                            Items: <span className="text-foreground font-medium">{file.extraction.items.length}</span>
                                          </span>
                                        )}
                                        {file.extraction.expenses.length > 0 && (
                                          <span className="text-muted-foreground">
                                            Expenses: <span className="text-foreground font-medium">{file.extraction.expenses.length}</span>
                                          </span>
                                        )}
                                      </div>
                                    )}
                                    {file.extraction?.needs_user_mapping && (
                                      <p className="mt-1 text-[11px] text-amber-600">
                                        ⚠ Some fields may need verification
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {file.status === "uploaded" && file.content && !file.extraction && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 gap-1 text-primary"
                                        onClick={() => handleAutoDetect(file.id)}
                                      >
                                        <Wand2 className="h-3 w-3" />
                                        Extract
                                      </Button>
                                    )}
                                    {!["analyzing", "extracting", "categorizing"].includes(file.status) && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeFile(file.id)}
                                        data-testid={`button-remove-${file.id}`}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                {/* Document Preview for OCR results */}
                                {file.ocrResult && (
                                  <div className="mt-2">
                                    <DocumentPreview 
                                      fileName={file.name}
                                      ocrResult={file.ocrResult}
                                      category={file.extraction?.file_kind || file.detectedCategory}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Premium Sections - Locked */}
          {!isAnalyzing && (
            <Card className="mt-8">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col gap-5">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-foreground">
                          Pro features
                        </h3>
                        <Badge variant="secondary" className="text-[10px]">
                          <Lock className="h-2.5 w-2.5 mr-1" />
                          Upgrade
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Unlock additional document types and AI-powered insights.
                      </p>
                    </div>
                  </div>

                  {/* Premium Features Grid */}
                  <div className="grid sm:grid-cols-2 gap-2">
                    {premiumSections.map((section) => (
                      <div 
                        key={section.id}
                        className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50 border border-border/30"
                      >
                        <div className="w-8 h-8 rounded-md bg-background flex items-center justify-center shrink-0 border border-border/50">
                          {section.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground">{section.title}</p>
                          <p className="text-[11px] text-muted-foreground">{section.description}</p>
                        </div>
                      </div>
                    ))}
                    {/* AI Assistant Feature */}
                    <div className="flex items-center gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground">AI Assistant</p>
                        <p className="text-[11px] text-muted-foreground">Ask questions about your data</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link to="/pricing" className="block">
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      View Plans
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analyze Button */}
          {hasFiles && allUploaded && !isAnalyzing && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-center space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Ready to analyze {totalFiles} {totalFiles === 1 ? 'document' : 'documents'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    AI-powered scan using Gemini + GPT for cross-validated results
                  </p>
                </div>
                <Button 
                  size="lg"
                  className="gap-2" 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  data-testid="button-analyze"
                >
                  <Search className="h-4 w-4" />
                  Start Analysis
                </Button>
                <p className="text-[11px] text-muted-foreground">
                  Files are processed securely and never stored permanently
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* AI Chat Widget - Locked for free scans */}
      <AIChatWidget documentContext={hasFiles ? chatContext : undefined} locked={true} />
    </div>
  );
};

export default Uploads;
