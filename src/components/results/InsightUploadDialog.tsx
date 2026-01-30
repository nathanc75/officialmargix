import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, CheckCircle2, Loader2, File, Trash2, Tag, ShoppingCart, DollarSign, Sparkles } from "lucide-react";
import { useAnalysis, LeakAnalysis } from "@/context/AnalysisContext";
import { useToast } from "@/hooks/use-toast";
import { AnalysisProgress, AnalysisStep } from "@/components/AnalysisProgress";
import { supabase } from "@/integrations/supabase/client";
import type { InsightCategory } from "./DeeperInsightsSection";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "uploaded" | "extracting" | "analyzing" | "analyzed" | "error";
  content?: string;
  ocrResult?: any;
  base64Data?: string;
}

interface CategoryConfig {
  title: string;
  description: string;
  icon: React.ReactNode;
  accept: string;
  placeholder: string;
}

const categoryConfigs: Record<InsightCategory, CategoryConfig> = {
  pricing: {
    title: "Your Listed Prices",
    description: "Upload your menu, rate sheet, or price list so we can spot underpricing and missed revenue opportunities.",
    icon: <Tag className="h-5 w-5 text-emerald-500" />,
    accept: ".csv,.pdf,.txt,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png,.webp,.gif,.heic,.bmp,.tiff",
    placeholder: "Menu (PDF or photo), service rate sheet, product price list, website pricing screenshots",
  },
  orders: {
    title: "What Customers Purchased",
    description: "Shows what customers actually bought. This helps identify best-selling items, low performers, and upsell opportunities.",
    icon: <ShoppingCart className="h-5 w-5 text-blue-500" />,
    accept: ".csv,.pdf,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png,.webp,.heic",
    placeholder: "POS sales export, Shopify product sales, invoice breakdown, itemized order report",
  },
  costs: {
    title: "Your Costs",
    description: "What it costs you to deliver your products or services. This allows us to estimate real profit, not just revenue.",
    icon: <DollarSign className="h-5 w-5 text-orange-500" />,
    accept: ".csv,.pdf,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png,.webp,.heic",
    placeholder: "Ingredient/product cost sheet, contractor payments, software expenses, operating costs",
  },
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getMimeType = (fileName: string): string => {
  const extension = fileName.toLowerCase().split(".").pop();
  const mimeTypes: Record<string, string> = {
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    pdf: "application/pdf",
    csv: "text/csv",
    txt: "text/plain",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    heic: "image/heic",
    bmp: "image/bmp",
    tiff: "image/tiff",
  };
  return mimeTypes[extension || ""] || "application/octet-stream";
};

const isImageOrPdf = (file: File): boolean => {
  return file.type.startsWith("image/") || file.type === "application/pdf";
};

const isOfficeDocument = (file: File): boolean => {
  const officeTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  const extension = file.name.toLowerCase().split(".").pop();
  return officeTypes.includes(file.type) || ["doc", "docx", "xls", "xlsx"].includes(extension || "");
};

const needsOCRProcessing = (file: File): boolean => {
  return isImageOrPdf(file) || isOfficeDocument(file);
};

interface InsightUploadDialogProps {
  category: InsightCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export function InsightUploadDialog({ category, open, onOpenChange, onComplete }: InsightUploadDialogProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setLeakAnalysis, leakAnalysis } = useAnalysis();
  const { toast } = useToast();

  const config = categoryConfigs[category];

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        status: "uploading",
      };
      
      newFiles.push(uploadedFile);
    }
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = newFiles[i].id;
      
      try {
        if (needsOCRProcessing(file)) {
          const base64Data = await readFileAsBase64(file);
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, base64Data } : f
          ));
          await performOCR(fileId, base64Data, file.type || getMimeType(file.name), file.name);
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
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      setAnalysisStep("starting");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAnalysisStep("ocr");
      const filesNeedingOCR = uploadedFiles.filter(f => f.base64Data && !f.ocrResult);
      for (const file of filesNeedingOCR) {
        if (file.base64Data) {
          await performOCR(file.id, file.base64Data, file.type, file.name);
        }
      }

      setAnalysisStep("categorize");
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: "analyzing" as const })));
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setAnalysisStep("gemini_analysis");
      await new Promise(resolve => setTimeout(resolve, 800));

      setAnalysisStep("gpt_analysis");
      
      // Prepare content for this category
      const categoryLabel = config.title.toUpperCase();
      const newContent = uploadedFiles
        .filter(f => f.content)
        .map(f => `--- ${f.name} ---\n${f.content}`)
        .join("\n\n");
      
      const categorizedContent = `=== ${categoryLabel} ===\n${newContent}`;
      
      // Call the analysis with the additional context
      const { data: leakData, error: leakError } = await supabase.functions.invoke("analyze-leaks", {
        body: { 
          fileContent: categorizedContent,
          fileNames: uploadedFiles.map(f => f.name),
          categories: {
            [category]: uploadedFiles.map(f => f.name),
          },
          ocrResults: uploadedFiles.filter(f => f.ocrResult).map(f => ({
            fileName: f.name,
            ocrResult: f.ocrResult,
          })),
          scanType: "enhanced",
          existingAnalysis: leakAnalysis, // Pass existing analysis for context
        },
      });
      
      if (leakError) {
        throw new Error(leakError.message || "Analysis failed");
      }
      
      setAnalysisStep("cross_validation");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAnalysisStep("complete");
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: "analyzed" as const })));
      
      // Update the leak analysis with enhanced results
      setLeakAnalysis(leakData.analysis as LeakAnalysis);
      
      toast({
        title: "Analysis Enhanced",
        description: `Your ${config.title.toLowerCase()} data has been analyzed and insights updated.`,
      });
      
      setTimeout(() => {
        onComplete();
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

  const hasFiles = uploadedFiles.length > 0;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isAnalyzing) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setUploadedFiles([]);
        setAnalysisStep(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {config.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Analysis Progress */}
          {isAnalyzing && analysisStep && (
            <AnalysisProgress currentStep={analysisStep} />
          )}

          {/* Upload Section */}
          {!isAnalyzing && (
            <Card className="border border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Section Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{config.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
                    </div>
                  </div>

                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      {uploadedFiles.map(file => (
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
                          ) : file.status === "error" ? (
                            <span className="text-[10px] text-destructive">Error</span>
                          ) : null}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeFile(file.id)}
                          >
                            <Trash2 className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Zone */}
                  <div
                    className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={config.accept}
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 opacity-70">
                      {config.placeholder}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analyze Button */}
          {!isAnalyzing && (
            <Button 
              className="w-full gap-2 brand-gradient border-0 text-white" 
              size="lg"
              disabled={!hasFiles || uploadedFiles.some(f => f.status === "uploading" || f.status === "extracting")}
              onClick={handleAnalyze}
            >
              <Sparkles className="h-4 w-4" />
              Analyze & Enhance Results
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
