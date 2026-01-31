import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, 
  Brain, 
  AlertTriangle, 
  TrendingDown, 
  CreditCard, 
  ArrowRight, 
  Sparkles, 
  Lock,
  Zap,
  Crown,
  FileText
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import POSConnectSection from "@/components/dashboard/POSConnectSection";
import { useUser } from "@/context/UserContext";
import { useAnalysis } from "@/context/AnalysisContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";

const FreeAnalysis = () => {
  const { user } = useUser();
  const { leakAnalysis, hasData: hasAnalysisData, addExtraction } = useAnalysis();
  const { tier } = useSubscription();
  const navigate = useNavigate();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  
  const hasData = hasAnalysisData || hasUploaded;

  // Helper to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix to get pure base64
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Parse spreadsheet files client-side
  const parseSpreadsheet = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          // Convert to CSV text for AI processing
          const csvText = XLSX.utils.sheet_to_csv(worksheet);
          resolve(csvText);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const allowedExtensions = ['.csv', '.xlsx', '.xls', '.pdf', '.png', '.jpg', '.jpeg', '.docx'];
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      toast.error("Supported formats: CSV, Excel, PDF, images, and Word documents");
      return;
    }

    setIsUploading(true);
    setProcessingStep("Reading file...");
    
    try {
      const isSpreadsheet = fileName.endsWith('.csv') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
      const isImage = fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg');
      const isPdf = fileName.endsWith('.pdf');
      
      let textContent = "";
      let imageBase64 = "";
      let imageMimeType = "";

      if (isSpreadsheet) {
        // Parse spreadsheet client-side
        setProcessingStep("Parsing spreadsheet...");
        textContent = await parseSpreadsheet(file);
      } else if (isImage || isPdf) {
        // Convert to base64 for OCR
        setProcessingStep("Preparing for OCR...");
        imageBase64 = await fileToBase64(file);
        imageMimeType = file.type || (isPdf ? "application/pdf" : "image/jpeg");
      } else {
        // Word docs - read as text (simplified)
        setProcessingStep("Reading document...");
        textContent = await file.text();
      }

      // Step 1: OCR if needed (images/PDFs)
      if (imageBase64) {
        setProcessingStep("Extracting text with AI OCR...");
        const { data: ocrData, error: ocrError } = await supabase.functions.invoke("analyze-ocr", {
          body: { imageBase64, imageMimeType, fileName: file.name },
        });

        if (ocrError) {
          throw new Error(ocrError.message || "OCR failed");
        }

        // Get raw text from OCR result
        textContent = ocrData?.ocrResult?.rawText || "";
        if (!textContent) {
          throw new Error("Could not extract text from document");
        }
      }

      // Step 2: Extract structured data
      setProcessingStep("Analyzing document with AI...");
      const { data: extractData, error: extractError } = await supabase.functions.invoke("analyze-extract", {
        body: { textContent, fileName: file.name, fileType: file.type },
      });

      if (extractError) {
        throw new Error(extractError.message || "Extraction failed");
      }

      if (!extractData?.success || !extractData.extraction) {
        throw new Error(extractData?.error || "No extraction data returned");
      }

      // Add to analysis context
      addExtraction(extractData.extraction);
      
      setHasUploaded(true);
      setUploadDialogOpen(false);
      setProcessingStep("");
      toast.success("Analysis complete! Viewing results...");
      
      // Navigate to results after a brief delay
      setTimeout(() => {
        navigate("/results");
      }, 1000);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to process file");
      setProcessingStep("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 via-background to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-primary/3 to-purple-500/3 blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative">
        <DashboardHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Free Analysis Badge */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Free Analysis — Limited Features</span>
            </div>
          </div>

          {/* AI Status Strip */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-secondary/80 via-secondary/50 to-transparent border border-border/50 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
              <div className={`w-2.5 h-2.5 rounded-full ${hasData ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <div className={`absolute w-2.5 h-2.5 rounded-full ${hasData ? 'bg-emerald-500' : 'bg-amber-500'} animate-ping opacity-75`} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-sm font-medium text-foreground">
                AI Status: {hasData ? (
                  <span className="text-emerald-600 dark:text-emerald-400">Analysis complete</span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">Waiting for documents</span>
                )}
              </span>
              {!hasData && (
                <span className="text-xs text-muted-foreground">
                  Upload a POS report to begin your free analysis.
                </span>
              )}
            </div>
          </div>

          {/* Hero Upload Card */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 via-primary/5 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl" />
            
            <CardContent className="relative p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center shadow-lg shadow-primary/25 shrink-0">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Complimentary scan — your AI is standing by.</p>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                      Your AI Financial Monitor is <span className="text-gradient">Ready</span>
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                      Upload your POS report to start your free analysis.
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        Your documents are encrypted and processed securely.
                      </span>
                    </div>
                  </div>
                </div>
                
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full lg:w-auto gap-2 shadow-lg shadow-primary/25 h-12 px-6">
                      <Upload className="w-5 h-5" />
                      Upload File
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Upload POS Report
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="text-sm text-muted-foreground">
                        Upload a single file containing your POS sales report. This is limited in the free tier.
                      </div>
                      <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                        <label className="cursor-pointer">
                          <span className="text-primary font-medium hover:underline">Choose file</span>
                          <Input
                            type="file"
                            accept=".csv,.xlsx,.xls,.pdf,.png,.jpg,.jpeg,.docx"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                          />
                        </label>
                        <p className="text-xs text-muted-foreground mt-2">
                          CSV, Excel, PDF, images, Word • Max 10MB
                        </p>
                      </div>
                      {isUploading && (
                        <div className="flex flex-col items-center justify-center gap-2 py-2">
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm text-muted-foreground">{processingStep || "Processing..."}</span>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* What AI Finds Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">What Your AI Will Monitor</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="group relative overflow-hidden border border-border/60 bg-card hover:shadow-lg hover:border-border transition-all duration-300">
                <CardContent className="relative p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors duration-300">
                      <TrendingDown className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1.5">Missed Payments</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">AI checks invoices and payments to detect underpaid, late, or unpaid revenue.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group relative overflow-hidden border border-border/60 bg-card hover:shadow-lg hover:border-border transition-all duration-300">
                <CardContent className="relative p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors duration-300">
                      <CreditCard className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1.5">Duplicate Charges</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">AI looks for vendors or services charging more than once.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group relative overflow-hidden border border-border/60 bg-card hover:shadow-lg hover:border-border transition-all duration-300">
                <CardContent className="relative p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors duration-300">
                      <AlertTriangle className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1.5">Forgotten Subscriptions</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">AI tracks recurring charges and flags subscriptions that appear unused.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recoverable Revenue Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-secondary/80 to-secondary/40 border border-border/50 shadow-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">The average account has</span>
              <span className="text-sm font-bold text-primary">$847</span>
              <span className="text-sm text-muted-foreground">in recoverable revenue</span>
            </div>
          </div>

          {/* Locked POS Connect Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-muted border border-border flex items-center justify-center">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">POS Connections available on paid plans</p>
                <Link to="/pricing">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Crown className="w-4 h-4" />
                    Upgrade to Unlock
                  </Button>
                </Link>
              </div>
            </div>
            <div className="opacity-50 pointer-events-none">
              <POSConnectSection />
            </div>
          </div>

          {/* Upgrade CTA */}
          <Card className="border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Unlock Full Analysis</h3>
                    <p className="text-sm text-muted-foreground">Upload unlimited files, connect POS systems, and get AI-powered insights.</p>
                  </div>
                </div>
                <Link to="/pricing">
                  <Button className="gap-2 shadow-lg shadow-primary/25">
                    <Crown className="w-4 h-4" />
                    View Plans
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default FreeAnalysis;
