import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, CheckCircle2, Loader2, File, Trash2, CreditCard, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAnalysis, LeakAnalysis } from "@/context/AnalysisContext";
import { useToast } from "@/hooks/use-toast";
import { AnalysisProgress, AnalysisStep } from "@/components/AnalysisProgress";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "uploaded" | "extracting" | "categorizing" | "analyzing" | "analyzed" | "error";
  content?: string;
  ocrResult?: any;
  base64Data?: string;
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

const needsOCRProcessing = (file: File): boolean => {
  return isImageOrPdf(file);
};

interface FreeUploadDialogProps {
  children: React.ReactNode;
  onAnalysisComplete?: () => void;
}

export function FreeUploadDialog({ children, onAnalysisComplete }: FreeUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setLeakAnalysis } = useAnalysis();
  const { toast } = useToast();

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const readSpreadsheetAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          
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
    setUploadedFile(prev => prev ? { ...prev, status: "extracting" as const } : null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-ocr", {
        body: {
          imageBase64: base64Data,
          imageMimeType: mimeType,
          fileName,
        },
      });

      if (error) throw new Error(error.message || "OCR failed");
      
      setUploadedFile(prev => prev ? { 
        ...prev, 
        ocrResult: data.ocrResult,
        content: data.ocrResult.rawText,
        status: "uploaded" as const 
      } : null);

      return data.ocrResult;
    } catch (error) {
      console.error("OCR error:", error);
      setUploadedFile(prev => prev ? { ...prev, status: "error" as const } : null);
      return null;
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Only allow one file
    const file = files[0];
    const fileId = `file-${Date.now()}`;
    
    // Determine the file type
    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");
    const isCsv = fileName.endsWith(".csv");
    const isPdf = fileName.endsWith(".pdf");
    const isImage = file.type.startsWith("image/") || 
                   [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".bmp", ".tiff"].some(ext => fileName.endsWith(ext));
    
    // Determine mime type
    let mimeType = file.type;
    if (!mimeType || mimeType === "application/octet-stream") {
      mimeType = getMimeType(file.name);
    }
    
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: mimeType,
      status: "uploading",
    };
    
    setUploadedFile(newFile);
    
    // Clear input immediately
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    try {
      if (isExcel) {
        const textContent = await readSpreadsheetAsText(file);
        setUploadedFile(prev => prev ? { 
          ...prev, 
          content: textContent, 
          status: "uploaded" as const,
          ocrResult: {
            rawText: textContent,
            confidence: 1.0,
            documentType: "spreadsheet",
            structuredData: { source: "direct_extraction" }
          }
        } : null);
      } else if (isCsv) {
        const textContent = await readFileContent(file);
        setUploadedFile(prev => prev ? { 
          ...prev, 
          content: textContent, 
          status: "uploaded" as const,
          ocrResult: {
            rawText: textContent,
            confidence: 1.0,
            documentType: "csv",
            structuredData: { source: "direct_extraction" }
          }
        } : null);
      } else if (isPdf || isImage) {
        // OCR processing for images and PDFs
        const base64Data = await readFileAsBase64(file);
        setUploadedFile(prev => prev ? { ...prev, base64Data } : null);
        await performOCR(fileId, base64Data, mimeType, file.name);
      } else {
        // Text-based files
        const content = await readFileContent(file);
        setUploadedFile(prev => prev ? { 
          ...prev, 
          status: "uploaded" as const, 
          content,
          ocrResult: {
            rawText: content,
            confidence: 1.0,
            documentType: "text",
            structuredData: { source: "direct_extraction" }
          }
        } : null);
      }
    } catch (err) {
      console.error("File processing error:", err);
      setUploadedFile(prev => prev ? { ...prev, status: "error" as const } : null);
      toast({
        title: "File Error",
        description: "Could not read the file. Please try a different format.",
        variant: "destructive",
      });
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    
    try {
      setAnalysisStep("starting");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAnalysisStep("ocr");
      if (uploadedFile.base64Data && !uploadedFile.ocrResult) {
        await performOCR(uploadedFile.id, uploadedFile.base64Data, uploadedFile.type, uploadedFile.name);
      }

      setAnalysisStep("categorize");
      setUploadedFile(prev => prev ? { ...prev, status: "analyzing" as const } : null);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setAnalysisStep("gemini_analysis");
      await new Promise(resolve => setTimeout(resolve, 800));

      setAnalysisStep("gpt_analysis");
      
      const categorizedContent = `=== MONEY IN & PAYOUTS ===\n--- ${uploadedFile.name} ---\n${uploadedFile.content}`;
      
      const { data: leakData, error: leakError } = await supabase.functions.invoke("analyze-leaks", {
        body: { 
          fileContent: categorizedContent,
          fileNames: [uploadedFile.name],
          categories: {
            payments: [uploadedFile.name],
          },
          ocrResults: uploadedFile.ocrResult ? [{
            fileName: uploadedFile.name,
            ocrResult: uploadedFile.ocrResult,
          }] : [],
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
      setUploadedFile(prev => prev ? { ...prev, status: "analyzed" as const } : null);
      setLeakAnalysis(result.analysis as LeakAnalysis);
      
      onAnalysisComplete?.();
      
      setTimeout(() => {
        setOpen(false);
        navigate("/free-results");
      }, 1000);
      
    } catch (error) {
      console.error("Analysis failed:", error);
      setUploadedFile(prev => prev ? { ...prev, status: "error" as const } : null);
      setIsAnalyzing(false);
      setAnalysisStep(null);
      toast({
        title: "Analysis Failed",
        description: "We couldn't analyze your file. Please try again or upload a different file.",
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isAnalyzing) {
      setOpen(newOpen);
      if (!newOpen) {
        setUploadedFile(null);
        setAnalysisStep(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg max-h-[90vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Free Analysis
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
              1 File Limit
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Analysis Progress */}
          {isAnalyzing && analysisStep && (
            <AnalysisProgress currentStep={analysisStep} />
          )}

          {/* Uploaded File */}
          {uploadedFile && !isAnalyzing && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border border-border/50">
                <CreditCard className="h-4 w-4 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Ready for analysis</p>
                <p className="text-sm font-medium text-foreground truncate">{uploadedFile.name}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={removeFile}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Upload Section */}
          {!isAnalyzing && !uploadedFile && (
            <Card className="border border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">💰 Money In & Payouts</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Upload one payment or payout report to begin your free analysis.</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border/60 rounded-lg p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/50 transition-all duration-200"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      CSV, PDF, Excel, or image formats supported
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".csv,.pdf,.txt,.tsv,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png,.webp,.gif,.heic"
                      onChange={handleFileSelect}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground/70 text-center">
                    Examples: Stripe export, PayPal activity, Square payments report
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {!isAnalyzing && (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAnalyze}
                disabled={!uploadedFile || uploadedFile.status !== "uploaded"}
                className="gap-2"
              >
                {uploadedFile?.status === "uploading" || uploadedFile?.status === "extracting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze Document
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
