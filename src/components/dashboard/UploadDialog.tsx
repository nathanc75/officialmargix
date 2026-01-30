import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, CheckCircle2, Loader2, File, Trash2, CreditCard, ListOrdered, ArrowRight, Sparkles, ShoppingCart, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAnalysis, LeakAnalysis } from "@/context/AnalysisContext";
import { useToast } from "@/hooks/use-toast";
import { AnalysisProgress, AnalysisStep } from "@/components/AnalysisProgress";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/contexts/SubscriptionContext";

type DocumentCategory = "payments" | "pricing" | "orders" | "costs";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: DocumentCategory;
  status: "uploading" | "uploaded" | "extracting" | "categorizing" | "analyzing" | "analyzed" | "error";
  content?: string;
  ocrResult?: any;
  base64Data?: string;
}

interface UploadSectionConfig {
  id: DocumentCategory;
  title: string;
  description: string;
  icon: React.ReactNode;
  accept: string;
  placeholder: string;
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

interface UploadDialogProps {
  children: React.ReactNode;
}

export function UploadDialog({ children }: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep | null>(null);
  const paymentsInputRef = useRef<HTMLInputElement>(null);
  const pricingInputRef = useRef<HTMLInputElement>(null);
  const ordersInputRef = useRef<HTMLInputElement>(null);
  const costsInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setLeakAnalysis } = useAnalysis();
  const { toast } = useToast();
  const { isPaid } = useSubscription();

  const baseSections: UploadSectionConfig[] = [
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

  const premiumSections: UploadSectionConfig[] = [
    {
      id: "pricing",
      title: "Your Prices / Menu / Service Rates",
      description: "Upload your menu, price list, service rates, or product pricing. Helps detect underpricing and missed revenue.",
      icon: <ListOrdered className="h-5 w-5 text-emerald-500" />,
      accept: ".csv,.pdf,.txt,.xlsx,.jpg,.jpeg,.png,.webp,.gif,.heic,.bmp,.tiff",
      placeholder: "PDFs, images/screenshots, price lists, menus, website pricing exports",
    },
    {
      id: "orders",
      title: "Orders / Sales Report",
      description: "Upload itemized sales or order reports from your POS, store, or invoicing system.",
      icon: <ShoppingCart className="h-5 w-5 text-blue-500" />,
      accept: ".csv,.pdf,.xlsx,.jpg,.jpeg,.png,.webp,.heic",
      placeholder: "POS sales export, product-level sales CSV, order breakdown report",
      optional: true,
    },
    {
      id: "costs",
      title: "Costs / Expenses",
      description: "Upload cost data (ingredients, product costs, contractor payments, software, etc.) to calculate real profit.",
      icon: <DollarSign className="h-5 w-5 text-orange-500" />,
      accept: ".csv,.pdf,.xlsx,.jpg,.jpeg,.png,.webp,.heic",
      placeholder: "Ingredient costs, product costs, contractor payments, software expenses",
      optional: true,
    },
  ];

  // For paid users: payments + premium pricing + orders + costs
  // For free users: payments + basic pricing (optional)
  const sections = isPaid 
    ? [baseSections[0], ...premiumSections] 
    : baseSections;

  const getInputRef = (category: DocumentCategory) => {
    switch (category) {
      case "payments": return paymentsInputRef;
      case "pricing": return pricingInputRef;
      case "orders": return ordersInputRef;
      case "costs": return costsInputRef;
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
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

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
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = newFiles[i].id;
      
      try {
        if (isImageOrPdf(file)) {
          const base64Data = await readFileAsBase64(file);
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, base64Data } : f
          ));
          await performOCR(fileId, base64Data, file.type, file.name);
        } else {
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
    
    const inputRef = getInputRef(category);
    if (inputRef?.current) {
      inputRef.current.value = "";
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
      setAnalysisStep("ocr");
      const filesNeedingOCR = uploadedFiles.filter(f => f.base64Data && !f.ocrResult);
      for (const file of filesNeedingOCR) {
        if (file.base64Data) {
          await performOCR(file.id, file.base64Data, file.type, file.name);
        }
      }

      setAnalysisStep("categorize");
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: "analyzing" as const })));
      
      setAnalysisStep("gemini_analysis");
      await new Promise(resolve => setTimeout(resolve, 500));

      setAnalysisStep("gpt_analysis");
      
      const categorizedContent = sections.map(section => {
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
      
      setAnalysisStep("cross_validation");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = leakData;
      
      setAnalysisStep("complete");
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: "analyzed" as const })));
      setLeakAnalysis(result.analysis as LeakAnalysis);
      
      setTimeout(() => {
        setOpen(false);
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
  const hasFiles = totalFiles > 0;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isAnalyzing) {
      setOpen(newOpen);
      if (!newOpen) {
        // Reset state when closing
        setUploadedFiles([]);
        setAnalysisStep(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Upload Documents for Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Analysis Progress */}
          {isAnalyzing && analysisStep && (
            <AnalysisProgress currentStep={analysisStep} />
          )}

          {/* File Count */}
          {hasFiles && !isAnalyzing && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border border-border/50">
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

          {/* Upload Sections */}
          {!isAnalyzing && (
            <div className="space-y-4">
              {sections.map((section) => {
                const files = getFilesForCategory(section.id);
                const inputRef = getInputRef(section.id);

                return (
                  <Card key={section.id} className="border border-border/50 bg-card/50">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Section Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                              {section.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-medium text-foreground">{section.title}</h3>
                                {section.optional && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-muted-foreground">
                                    Optional
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>
                            </div>
                          </div>
                        </div>

                        {/* Uploaded Files */}
                        {files.length > 0 && (
                          <div className="space-y-2">
                            {files.map(file => (
                              <div key={file.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border/30">
                                <File className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</p>
                                </div>
                                {file.status === "uploading" || file.status === "extracting" ? (
                                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                                ) : file.status === "uploaded" || file.status === "analyzed" ? (
                                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                ) : null}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                  onClick={() => removeFile(file.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Upload Button */}
                        <div
                          className="border border-dashed border-border/60 rounded-lg p-4 hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => inputRef?.current?.click()}
                        >
                          <div className="flex flex-col items-center gap-2 text-center">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              Drop files here or click to upload
                            </p>
                            <p className="text-[10px] text-muted-foreground/70">
                              {section.placeholder}
                            </p>
                          </div>
                          <input
                            ref={inputRef}
                            type="file"
                            accept={section.accept}
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileSelect(e, section.id)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Analyze Button */}
          {hasFiles && !isAnalyzing && (
            <Button 
              className="w-full gap-2 h-11"
              onClick={handleAnalyze}
            >
              <Sparkles className="h-4 w-4" />
              Analyze {totalFiles} {totalFiles === 1 ? "File" : "Files"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
