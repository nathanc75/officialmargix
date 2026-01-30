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
import * as XLSX from "xlsx";

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
  hint?: string;
}

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

const isSpreadsheet = (file: File): boolean => {
  const spreadsheetTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "text/csv",
    "application/csv",
  ];
  const extension = file.name.toLowerCase().split(".").pop();
  return spreadsheetTypes.includes(file.type) || ["xls", "xlsx", "csv"].includes(extension || "");
};

const isWordDocument = (file: File): boolean => {
  const wordTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/msword", // .doc
  ];
  const extension = file.name.toLowerCase().split(".").pop();
  return wordTypes.includes(file.type) || ["doc", "docx"].includes(extension || "");
};

// Only images and PDFs need OCR processing - spreadsheets are handled on frontend
const needsOCRProcessing = (file: File): boolean => {
  return isImageOrPdf(file);
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

  // Initial upload only shows Money In & Payouts - other categories are offered on results page
  const sections: UploadSectionConfig[] = [
    {
      id: "payments",
      title: "💰 Money In & Payouts",
      description: "Upload one report from where you get paid. This helps us understand your revenue, fees, refunds, and payout trends.",
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      accept: ".csv,.pdf,.txt,.tsv,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png,.webp,.gif,.heic",
      placeholder: "Stripe export, PayPal activity report, Square payments report, Uber Eats/DoorDash earnings",
      hint: "One file is enough to begin.",
    },
  ];

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

  // Read Excel files and convert to text using xlsx library
  const readSpreadsheetAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          
          // Convert all sheets to CSV text
          const allSheetsText: string[] = [];
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            allSheetsText.push(`=== Sheet: ${sheetName} ===\n${csv}`);
          });
          
          resolve(allSheetsText.join("\n\n"));
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
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
        const fileName = file.name.toLowerCase();
        const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");
        const isCsv = fileName.endsWith(".csv") || file.type === "text/csv" || file.type === "application/csv";
        
        if (isExcel) {
          // For Excel files, extract text content on frontend using xlsx library
          const textContent = await readSpreadsheetAsText(file);
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId ? { 
              ...f, 
              content: textContent, 
              status: "uploaded" as const,
              ocrResult: {
                rawText: textContent,
                confidence: 1.0,
                documentType: "spreadsheet",
                structuredData: { source: "direct_extraction" }
              }
            } : f
          ));
        } else if (isCsv) {
          // For CSV files, read as text directly
          const textContent = await readFileContent(file);
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId ? { 
              ...f, 
              content: textContent, 
              status: "uploaded" as const,
              ocrResult: {
                rawText: textContent,
                confidence: 1.0,
                documentType: "csv",
                structuredData: { source: "direct_extraction" }
              }
            } : f
          ));
        } else if (needsOCRProcessing(file)) {
          // For images and PDFs, use OCR with vision
          const base64Data = await readFileAsBase64(file);
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, base64Data } : f
          ));
          await performOCR(fileId, base64Data, file.type || getMimeType(file.name), file.name);
        } else {
          // For plain text files (.txt, .tsv, .doc, .docx), read directly
          const content = await readFileContent(file);
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, status: "uploaded" as const, content } : f
          ));
        }
      } catch (err) {
        console.error("File processing error:", err);
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
      // Start with the very first step
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
                            {section.hint && (
                              <p className="text-[10px] text-primary/80 font-medium mt-1">
                                {section.hint}
                              </p>
                            )}
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
