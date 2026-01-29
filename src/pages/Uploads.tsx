import { useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload, CheckCircle2, Plus, Loader2, Search, Sparkles, AlertCircle, File, Trash2, CreditCard, ListOrdered, Lock, Building2, Receipt, ReceiptText, ArrowRight, Wand2, Brain } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { useAnalysis, LeakAnalysis } from "@/context/AnalysisContext";
import { useToast } from "@/hooks/use-toast";
import { AIChatWidget } from "@/components/AIChatWidget";
import { DocumentPreview, OCRResult } from "@/components/DocumentPreview";
import { AnalysisProgress, AnalysisStep } from "@/components/AnalysisProgress";
import { supabase } from "@/integrations/supabase/client";

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
}

interface UploadSectionConfig {
  id: DocumentCategory;
  title: string;
  description: string;
  icon: React.ReactNode;
  accept: string;
  placeholder: string;
  locked?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isImageOrPdf = (file: File): boolean => {
  return file.type.startsWith("image/") || file.type === "application/pdf";
};

const Uploads = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep | null>(null);
  const paymentsInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setLeakAnalysis, leakAnalysis } = useAnalysis();
  const { toast } = useToast();

  // Free scan sections - only payment reports
  const freeSections: UploadSectionConfig[] = [
    {
      id: "payments",
      title: "Payment or Payout Report",
      description: "Upload your payment processor or payout report",
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      accept: ".csv,.pdf,.txt,.tsv,.xlsx,.jpg,.jpeg,.png,.webp,.gif,.heic",
      placeholder: "Stripe, PayPal, Square, DoorDash, Uber Eats payouts",
    },
  ];

  // Premium sections - locked for free users
  const premiumSections: UploadSectionConfig[] = [
    {
      id: "pricing",
      title: "Menu, Product List, or Pricing",
      description: "Upload screenshots, photos, or files of your menu or product catalog",
      icon: <ListOrdered className="h-5 w-5 text-muted-foreground" />,
      accept: ".csv,.pdf,.txt,.xlsx,.jpg,.jpeg,.png,.webp,.gif,.heic,.bmp,.tiff",
      placeholder: "Menu screenshots, product photos, price lists",
      locked: true,
    },
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

  // OCR extraction for images/PDFs
  const performOCR = useCallback(async (fileId: string, base64Data: string, mimeType: string, fileName: string) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: "extracting" as const } : f
    ));

    try {
      const { data, error } = await supabase.functions.invoke("analyze-ocr", {
        body: {
          imageBase64: base64Data,
          imageMimeType: mimeType,
          fileName,
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

  // Smart categorization
  const categorizeDocument = useCallback(async (fileId: string, content: string, fileName: string) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: "categorizing" as const } : f
    ));

    try {
      const { data, error } = await supabase.functions.invoke("analyze-categorize", {
        body: { textContent: content, fileName },
      });

      if (error) throw new Error(error.message || "Categorization failed");
      
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          detectedCategory: data.classification.category,
          categoryConfidence: data.classification.confidence,
          status: "uploaded" as const 
        } : f
      ));

      return data.classification;
    } catch (error) {
      console.error("Categorization error:", error);
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
        if (isImageOrPdf(file)) {
          // For images and PDFs, use OCR
          const base64Data = await readFileAsBase64(file);
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, base64Data } : f
          ));
          await performOCR(fileId, base64Data, file.type, file.name);
        } else {
          // For text files, read directly
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
      title: "Detecting Document Type",
      description: "AI is analyzing your document...",
    });

    const result = await categorizeDocument(fileId, file.content, file.name);
    
    if (result) {
      toast({
        title: "Document Classified",
        description: `Detected as ${result.category.replace("_", " ")} (${Math.round(result.confidence * 100)}% confidence)`,
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

      // Step 2: Auto-categorize uncategorized files
      setAnalysisStep("categorize");
      const filesNeedingCategory = uploadedFiles.filter(f => f.content && !f.detectedCategory);
      for (const file of filesNeedingCategory) {
        if (file.content) {
          await categorizeDocument(file.id, file.content, file.name);
        }
      }
      
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
        <section className="pt-28 pb-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 via-primary/5 to-transparent pointer-events-none" />
              <CardContent className="relative p-6 sm:p-8">
                <div className="flex flex-col gap-5">
                  <div className="space-y-3">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                      Find your missed revenue <span className="text-muted-foreground font-normal">(free scan)</span>
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                      Upload 1–2 documents and we'll scan for revenue leaks like failed payments, missing payouts, and pricing gaps. Results in minutes.
                    </p>
                  </div>
                  
                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                      <Search className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium text-primary">Revenue leak detection</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-600">Accurate data extraction</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />
                      <span className="text-xs font-medium text-amber-600">Double-checked results</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">

          {/* Analysis Progress (shown during analysis) */}
          {isAnalyzing && analysisStep && (
            <AnalysisProgress currentStep={analysisStep} />
          )}

          {/* File Count Indicator */}
          {hasFiles && !isAnalyzing && (
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Payment Reports</p>
                <p className="text-lg font-bold text-primary">
                  {totalFiles} {totalFiles === 1 ? "file" : "files"} ready
                </p>
              </div>
            </div>
          )}

          {/* Free Upload Sections */}
          {!isAnalyzing && (
            <div className="space-y-6">
              <div className="text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1">
                  Upload what we need to scan for lost revenue
                </h2>
                <p className="text-sm text-muted-foreground">
                  Most businesses have hidden revenue leaks — these files help us find yours.
                </p>
              </div>
              <div className="grid gap-5">
                {freeSections.map((section) => {
                  const inputRef = getInputRef(section.id);
                  const categoryFiles = getFilesForCategory(section.id);
                  const categoryFileCount = categoryFiles.length;
                  
                  return (
                    <Card 
                      key={section.id}
                      className="border-border bg-card shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {section.icon}
                            <div>
                              <h3 className="font-semibold text-foreground">{section.title}</h3>
                              <p className="text-xs text-muted-foreground">{section.description}</p>
                            </div>
                          </div>
                          {categoryFileCount > 0 && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              {categoryFileCount} file{categoryFileCount !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        
                        <div 
                          className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
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
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                            <Upload className="h-7 w-7 text-primary" />
                          </div>
                          <p className="text-base font-medium text-foreground mb-1">
                            Drop files here or click to browse
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            {section.placeholder}
                          </p>
                          <Button 
                            size="default"
                            className="gap-2" 
                            onClick={(e) => { e.stopPropagation(); inputRef?.current?.click(); }}
                            data-testid={`button-browse-${section.id}`}
                          >
                            <Plus className="h-4 w-4" />
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
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                                      {file.detectedCategory && (
                                        <Badge variant="outline" className="text-xs capitalize">
                                          {file.detectedCategory.replace("_", " ")}
                                          {file.categoryConfidence && ` ${Math.round(file.categoryConfidence * 100)}%`}
                                        </Badge>
                                      )}
                                      {file.ocrResult && (
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
                                        file.status === "categorizing" ? "Categorizing..." :
                                        file.status === "analyzing" ? "Analyzing..." :
                                        file.status === "analyzed" ? "Analyzed" :
                                        file.status === "error" ? "Error" : "Ready"
                                      }
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {file.status === "uploaded" && file.content && !file.detectedCategory && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 gap-1 text-primary"
                                        onClick={() => handleAutoDetect(file.id)}
                                      >
                                        <Wand2 className="h-3 w-3" />
                                        Auto-Detect
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
                                      category={file.detectedCategory}
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
            <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-amber-500/5 overflow-hidden mt-10">
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-500/10 via-amber-500/5 to-transparent pointer-events-none" />
              <CardContent className="relative p-6 sm:p-8">
                <div className="flex flex-col gap-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <Lock className="h-3.5 w-3.5 text-amber-600" />
                        <span className="text-xs font-medium text-amber-600">Pro Features</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                        Unlock deeper analysis
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-lg">
                        Upgrade to scan additional document types for more accurate, comprehensive leak detection.
                      </p>
                    </div>
                  </div>

                  {/* Premium Document Types Grid */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {premiumSections.map((section) => (
                      <div 
                        key={section.id}
                        className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50 transition-all duration-200 hover:bg-muted/80 hover:border-amber-500/30 hover:shadow-md hover:shadow-amber-500/10 hover:-translate-y-0.5 cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 transition-colors duration-200 group-hover:bg-amber-500/10">
                          {section.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate transition-colors duration-200 group-hover:text-amber-600">{section.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{section.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link to="/pricing" className="block">
                    <Button size="lg" className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-amber-500/25">
                      <Sparkles className="h-4 w-4" />
                      Upgrade to Pro
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analyze Button */}
          {hasFiles && allUploaded && !isAnalyzing && (
            <Card className="border-border bg-card shadow-sm mt-8">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Brain className="h-5 w-5 text-primary" />
                  <p className="text-lg font-semibold text-foreground">
                    Ready for Multi-Model Analysis
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                  {totalFiles} document{totalFiles !== 1 ? 's' : ''} will be analyzed using Gemini + GPT for cross-validated leak detection.
                </p>
                <Button 
                  size="lg"
                  className="gap-2 px-8" 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  data-testid="button-analyze"
                >
                  <Search className="h-5 w-5" />
                  Start AI-Powered Scan
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Files are processed securely and never stored permanently
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* AI Chat Widget - Locked for free scans */}
      <AIChatWidget documentContext={hasFiles ? chatContext : undefined} locked={true} />
    </div>
  );
};

export default Uploads;
