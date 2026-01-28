import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText, CheckCircle2, Plus, Loader2, Search, Sparkles, AlertCircle, File, Trash2, CreditCard, ListOrdered, Lock, Building2, Receipt, ReceiptText, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAnalysis, LeakAnalysis } from "@/context/AnalysisContext";
import { useToast } from "@/hooks/use-toast";

type DocumentCategory = "payments" | "pricing" | "bank" | "invoices" | "refunds" | "promos";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: DocumentCategory;
  status: "uploading" | "uploaded" | "analyzing" | "analyzed" | "error";
  content?: string;
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

const Uploads = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const paymentsInputRef = useRef<HTMLInputElement>(null);
  const pricingInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setLeakAnalysis } = useAnalysis();
  const { toast } = useToast();

  // Free scan sections - available to all users
  const freeSections: UploadSectionConfig[] = [
    {
      id: "payments",
      title: "Payment or Payout Report",
      description: "Upload your payment processor or payout report",
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      accept: ".csv,.pdf,.txt,.tsv,.xlsx",
      placeholder: "Stripe, PayPal, Square, DoorDash, Uber Eats payouts",
    },
    {
      id: "pricing",
      title: "Pricing, Menu, or Product List",
      description: "Upload your pricing structure or product catalog",
      icon: <ListOrdered className="h-5 w-5 text-emerald-600" />,
      accept: ".csv,.pdf,.txt,.xlsx",
      placeholder: "Menu PDF, price list, product catalog",
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
        const content = await readFileContent(file);
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: "uploaded", content } : f
        ));
      } catch {
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: "error" } : f
        ));
      }
    }
    
    // Reset input
    const inputRef = getInputRef(category);
    if (inputRef.current) {
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
    
    // Update all files to analyzing status
    setUploadedFiles(prev => prev.map(f => ({ ...f, status: "analyzing" as const })));
    
    try {
      // Combine all file contents for analysis, grouped by category
      const categorizedContent = freeSections.map(section => {
        const files = getFilesForCategory(section.id);
        if (files.length === 0) return "";
        return `=== ${section.title.toUpperCase()} ===\n${files.filter(f => f.content).map(f => `--- ${f.name} ---\n${f.content}`).join("\n\n")}`;
      }).filter(Boolean).join("\n\n");
      
      const response = await fetch("/api/analyze/leaks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fileContent: categorizedContent,
          fileNames: uploadedFiles.map(f => f.name),
          categories: {
            payments: getFilesForCategory("payments").map(f => f.name),
            pricing: getFilesForCategory("pricing").map(f => f.name),
          },
          scanType: "free",
        }),
      });
      
      if (!response.ok) {
        throw new Error("Analysis failed");
      }
      
      const result = await response.json();
      
      // Update files to analyzed status
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: "analyzed" as const })));
      
      // Store result in context and navigate
      setLeakAnalysis(result.analysis as LeakAnalysis);
      navigate("/results");
      
    } catch (error) {
      console.error("Analysis failed:", error);
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: "error" as const })));
      setIsAnalyzing(false);
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
  const allUploaded = uploadedFiles.every(f => f.status === "uploaded" || f.status === "analyzed");

  const getCategoryStats = () => {
    return freeSections.map(section => ({
      ...section,
      count: getFilesForCategory(section.id).length,
    }));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
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
        <header className="border-b border-border/50 bg-white/80 dark:bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back</span>
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Search className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-foreground">Free MARGIX Scan</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">Get a high-level snapshot of revenue leaks</p>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1.5 py-1 text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                <Sparkles className="h-3 w-3" />
                Free Scan
              </Badge>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Free Scan Info Banner */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-background overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">What the Free Scan Includes</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a <span className="font-medium text-foreground">payment or payout report</span> and your <span className="font-medium text-foreground">pricing, menu, or product list</span>. 
                    We'll highlight potential revenue leaks, fee impact, and pricing risks so you can see where issues may exist.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Stats */}
          {hasFiles && (
            <div className="grid grid-cols-2 gap-3">
              {getCategoryStats().map((stat) => (
                <div 
                  key={stat.id} 
                  className={`p-3 rounded-lg border text-center transition-all ${
                    stat.count > 0 
                      ? "bg-primary/5 border-primary/20" 
                      : "bg-secondary/50 border-border"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {stat.icon}
                    <span className="text-sm font-medium text-foreground">{stat.title}</span>
                  </div>
                  <p className={`text-lg font-bold ${stat.count > 0 ? "text-primary" : "text-muted-foreground"}`}>
                    {stat.count} {stat.count === 1 ? "file" : "files"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Free Upload Sections */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Upload Your Documents</h2>
            <div className="grid gap-4">
              {freeSections.map((section) => {
                const inputRef = getInputRef(section.id);
                const categoryFiles = getFilesForCategory(section.id);
                const categoryFileCount = categoryFiles.length;
                
                return (
                  <Card 
                    key={section.id}
                    className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
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
                        className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
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
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          Drop files here or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          {section.placeholder}
                        </p>
                        <Button 
                          size="sm"
                          variant="outline"
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
                            <div 
                              key={file.id}
                              className={`flex items-center gap-3 p-3 rounded-lg border ${
                                file.status === "error" 
                                  ? "bg-destructive/5 border-destructive/20" 
                                  : file.status === "analyzing"
                                    ? "bg-primary/5 border-primary/20"
                                    : "bg-secondary/50 border-border"
                              }`}
                            >
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                file.status === "error" 
                                  ? "bg-destructive/10" 
                                  : file.status === "analyzing"
                                    ? "bg-primary/10"
                                    : "bg-secondary"
                              }`}>
                                {file.status === "uploading" || file.status === "analyzing" ? (
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
                                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(file.size)} - {
                                    file.status === "uploading" ? "Uploading..." :
                                    file.status === "analyzing" ? "Analyzing..." :
                                    file.status === "analyzed" ? "Analyzed" :
                                    file.status === "error" ? "Error" : "Ready"
                                  }
                                </p>
                              </div>
                              {file.status !== "analyzing" && (
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
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Premium Locked Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unlock Deeper Analysis</h2>
              <Badge variant="outline" className="gap-1 text-amber-600 border-amber-500/30 bg-amber-500/5">
                <Lock className="h-3 w-3" />
                Pro Feature
              </Badge>
            </div>
            <Card className="border-dashed border-2 border-muted bg-muted/20">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Upgrade to analyze additional documents:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {premiumSections.map((section) => (
                        <div 
                          key={section.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 border border-border text-xs text-muted-foreground"
                        >
                          {section.icon}
                          <span>{section.title}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Get detailed breakdowns, ongoing analysis, and actionable recommendations.
                    </p>
                  </div>
                  <Link to="/pricing" className="shrink-0">
                    <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
                      View Plans
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analyze Button */}
          {hasFiles && allUploaded && (
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="text-lg font-semibold text-foreground">
                    Ready to Scan {totalFiles} Document{totalFiles !== 1 ? 's' : ''}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Our AI will analyze your documents to highlight potential revenue leaks, fee impact, and pricing risks.
                </p>
                <Button 
                  size="lg"
                  className="gap-2 brand-gradient border-0 text-white" 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  data-testid="button-analyze"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      Start Free Leak Scan
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Files are processed securely and never stored permanently
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Uploads;
