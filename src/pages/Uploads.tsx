import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText, CheckCircle2, Plus, Loader2, Search, Sparkles, AlertCircle, File, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAnalysis, LeakAnalysis } from "@/context/AnalysisContext";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "uploaded" | "analyzing" | "analyzed" | "error";
  content?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Uploads = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    
    // Update all files to analyzing status
    setUploadedFiles(prev => prev.map(f => ({ ...f, status: "analyzing" as const })));
    
    try {
      // Combine all file contents for analysis
      const combinedContent = uploadedFiles
        .filter(f => f.content)
        .map(f => `=== File: ${f.name} ===\n${f.content}`)
        .join("\n\n");
      
      const response = await fetch("/api/analyze/leaks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fileContent: combinedContent,
          fileNames: uploadedFiles.map(f => f.name),
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

  const uploadedCount = uploadedFiles.filter(f => f.status === "uploaded" || f.status === "analyzed").length;
  const hasFiles = uploadedFiles.length > 0;
  const allUploaded = uploadedFiles.every(f => f.status === "uploaded" || f.status === "analyzed");

  const acceptedFileTypes = [
    { label: "Bank Statements", desc: "PDF or CSV exports" },
    { label: "Payment Reports", desc: "Stripe, PayPal, Square" },
    { label: "Invoices", desc: "PDF invoices and receipts" },
    { label: "Expense Reports", desc: "CSV or PDF format" },
  ];

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
                    <h1 className="text-lg sm:text-xl font-bold text-foreground">Upload Documents</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">Upload your financial files for analysis</p>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1.5 py-1 text-xs bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-3 w-3" />
                Free Scan
              </Badge>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* File Types Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {acceptedFileTypes.map((type) => (
              <div key={type.label} className="p-3 rounded-lg bg-secondary/50 border border-border">
                <p className="text-sm font-medium text-foreground">{type.label}</p>
                <p className="text-xs text-muted-foreground">{type.desc}</p>
              </div>
            ))}
          </div>

          {/* Upload Area */}
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Financial Documents</h3>
                {uploadedCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {uploadedCount} file{uploadedCount !== 1 ? 's' : ''} ready
                  </Badge>
                )}
              </div>
              
              <div 
                className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.pdf,.txt,.tsv"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  data-testid="input-file-upload"
                />
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload bank statements, invoices, payment reports (PDF, CSV)
                </p>
                <Button 
                  size="default"
                  className="gap-2" 
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  data-testid="button-browse-files"
                >
                  <Plus className="h-4 w-4" />
                  Select Files
                </Button>
              </div>

              {/* Uploaded Files List */}
              {hasFiles && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-medium text-foreground">Uploaded Files</p>
                  {uploadedFiles.map((file) => (
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
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        file.status === "error" 
                          ? "bg-destructive/10" 
                          : file.status === "analyzing"
                            ? "bg-primary/10"
                            : "bg-secondary"
                      }`}>
                        {file.status === "uploading" || file.status === "analyzing" ? (
                          <Loader2 className="h-5 w-5 text-primary animate-spin" />
                        ) : file.status === "error" ? (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        ) : file.status === "analyzed" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <File className="h-5 w-5 text-muted-foreground" />
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

          {/* Analyze Button */}
          {hasFiles && allUploaded && (
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="text-lg font-semibold text-foreground">
                    Ready to Scan for Leaks
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Our AI will analyze your {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} 
                  {' '}to find missing payments, duplicate charges, unused subscriptions, and other revenue leaks.
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
