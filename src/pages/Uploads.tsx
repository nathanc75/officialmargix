import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText, CheckCircle2, Plus, Loader2, Zap, Link2, Sparkles, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import margixLogo from "@/assets/margix-logo.png";
import { useUpload } from "@/hooks/use-upload";

interface AnalysisSummary {
  totalRevenue?: { value: number; isEstimate: boolean };
  totalFees?: { value: number; isEstimate: boolean };
  totalPromos?: { value: number; isEstimate: boolean };
  totalRefunds?: { value: number; isEstimate: boolean };
  netProfit?: { value: number; isEstimate: boolean };
}

interface AnalysisData {
  summary?: AnalysisSummary;
  issues?: Array<{ type: string; description: string; potentialRecovery: number }>;
  items?: Array<{ name: string; quantity: number; revenue: number; profit: number; isEstimate: boolean }>;
  recommendations?: string[];
}

interface MenuData {
  platform?: string;
  menuItems?: Array<{ name: string; price: number; description?: string }>;
  notes?: string;
}

interface AnalysisResult {
  success: boolean;
  analysis?: AnalysisData;
  menuData?: MenuData;
  error?: string;
}

const formatEstValue = (value: number | undefined, isEstimate: boolean = true): string => {
  if (value === undefined || value === null) return "~$0.00";
  const formatted = `$${Math.abs(value).toFixed(2)}`;
  return isEstimate ? `~${formatted}` : formatted;
};

const Uploads = () => {
  const [hasUploadedReport, setHasUploadedReport] = useState(false);
  const [uploadedReportName, setUploadedReportName] = useState("");
  const [isAnalyzingReport, setIsAnalyzingReport] = useState(false);
  const [reportAnalysis, setReportAnalysis] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const analyzeReport = async (fileContent: string, fileName: string) => {
    setIsAnalyzingReport(true);
    try {
      const reportType = fileName.toLowerCase().includes('uber') ? 'Uber Eats' :
                        fileName.toLowerCase().includes('doordash') ? 'DoorDash' :
                        fileName.toLowerCase().includes('grubhub') ? 'Grubhub' : 'delivery';
      
      const response = await fetch("/api/analyze/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportContent: fileContent, reportType }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Server error" }));
        setReportAnalysis({ success: false, error: errorData.error || "Analysis failed" });
        return;
      }
      
      const result = await response.json();
      setReportAnalysis(result);
    } catch (error) {
      console.error("Report analysis failed:", error);
      setReportAnalysis({ success: false, error: "Analysis failed - please try again" });
    } finally {
      setIsAnalyzingReport(false);
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

  const [pendingReportFile, setPendingReportFile] = useState<File | null>(null);

  const { uploadFile: uploadReportFile, isUploading: isUploadingReport, progress: reportProgress } = useUpload({
    onSuccess: async (response) => {
      await fetch("/api/uploads/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: response.metadata.name,
          objectPath: response.objectPath,
          size: response.metadata.size,
          contentType: response.metadata.contentType,
          type: "report",
        }),
      });
      setUploadedReportName(response.metadata.name);
      setHasUploadedReport(true);
      
      // Trigger AI analysis for the report
      if (pendingReportFile) {
        const content = await readFileContent(pendingReportFile);
        analyzeReport(content, pendingReportFile.name);
        setPendingReportFile(null);
      }
    },
    onError: (error) => {
      console.error("Report upload failed:", error);
      alert("Upload failed. Please try again.");
      setPendingReportFile(null);
    },
  });

  const handleReportSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingReportFile(file);
      setReportAnalysis(null);
      await uploadReportFile(file);
    }
  };

  const handleAnalyze = () => {
    navigate("/dashboard");
  };

  const platforms = [
    { name: "UberEats", icon: "🚗", connected: true, color: "bg-green-500" },
    { name: "DoorDash", icon: "🚪", connected: true, color: "bg-red-500" },
    { name: "Grubhub", icon: "🍔", connected: false, color: "bg-orange-500" },
    { name: "Postmates", icon: "📦", connected: false, color: "bg-purple-500" },
    { name: "Square POS", icon: "⬜", connected: false, color: "bg-slate-700" },
    { name: "Toast", icon: "🍞", connected: false, color: "bg-orange-600" },
    { name: "Clover", icon: "🍀", connected: false, color: "bg-emerald-500" },
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back to Dashboard</span>
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8">
                    <img src={margixLogo} alt="MARGIX" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-foreground">Upload Files</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">Upload and connect to analyze</p>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1.5 py-1 text-xs bg-primary/10 text-primary border-primary/20">
                <Zap className="h-3 w-3" />
                Pro Plan
              </Badge>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Upload Your Data</h2>
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Delivery Reports</h3>
                </div>
                {!hasUploadedReport ? (
                  <div 
                    className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.txt,.tsv"
                      onChange={handleReportSelect}
                      className="hidden"
                      data-testid="input-file-upload"
                    />
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                      {isUploadingReport ? (
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      ) : (
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      {isUploadingReport ? "Uploading..." : "Drop reports here"}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {isUploadingReport 
                        ? `${reportProgress}%` 
                        : "CSV exports from Uber Eats, DoorDash, Grubhub"}
                    </p>
                    <Button 
                      size="sm"
                      className="gap-2" 
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      disabled={isUploadingReport}
                      data-testid="button-browse-reports"
                    >
                      {isUploadingReport ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      {isUploadingReport ? "Uploading..." : "Browse Files"}
                    </Button>
                  </div>
                ) : (
                  <div className={`border-2 rounded-xl p-6 text-center ${
                    isAnalyzingReport 
                      ? "border-primary/50 bg-primary/5" 
                      : reportAnalysis?.success 
                        ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10"
                        : reportAnalysis?.error
                          ? "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10"
                          : "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10"
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      isAnalyzingReport 
                        ? "bg-primary/20" 
                        : reportAnalysis?.success 
                          ? "bg-emerald-100 dark:bg-emerald-900/30"
                          : reportAnalysis?.error
                            ? "bg-amber-100 dark:bg-amber-900/30"
                            : "bg-emerald-100 dark:bg-emerald-900/30"
                    }`}>
                      {isAnalyzingReport ? (
                        <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                      ) : reportAnalysis?.success ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      ) : reportAnalysis?.error ? (
                        <AlertCircle className="h-6 w-6 text-amber-600" />
                      ) : (
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      {isAnalyzingReport 
                        ? "AI analyzing report..." 
                        : reportAnalysis?.success 
                          ? "Analysis complete" 
                          : reportAnalysis?.error
                            ? "Analysis issue"
                            : "Report uploaded"}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3 truncate max-w-[200px] mx-auto">
                      {isAnalyzingReport 
                        ? "Extracting financial data with GPT-4o-mini" 
                        : uploadedReportName}
                    </p>
                    {reportAnalysis?.success && reportAnalysis.analysis?.summary && (
                      <div className="mt-3 p-3 bg-secondary/50 rounded-lg text-left space-y-1">
                        <div className="flex items-center gap-1 mb-2">
                          <Sparkles className="h-3 w-3 text-primary" />
                          <span className="text-xs font-medium text-primary">AI Analysis Preview (Est.)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Revenue:</span>
                            <span className="ml-1 font-medium text-foreground">
                              {formatEstValue(reportAnalysis.analysis.summary.totalRevenue?.value, reportAnalysis.analysis.summary.totalRevenue?.isEstimate ?? true)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Fees:</span>
                            <span className="ml-1 font-medium text-foreground">
                              {formatEstValue(reportAnalysis.analysis.summary.totalFees?.value, reportAnalysis.analysis.summary.totalFees?.isEstimate ?? true)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Net Profit:</span>
                            <span className={`ml-1 font-medium ${(reportAnalysis.analysis.summary.netProfit?.value ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {formatEstValue(reportAnalysis.analysis.summary.netProfit?.value, reportAnalysis.analysis.summary.netProfit?.isEstimate ?? true)}
                            </span>
                          </div>
                          {reportAnalysis.analysis.issues && reportAnalysis.analysis.issues.length > 0 && (
                            <div>
                              <span className="text-muted-foreground">Issues:</span>
                              <span className="ml-1 font-medium text-amber-600">{reportAnalysis.analysis.issues.length} found</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="gap-2 mt-3" 
                      onClick={() => { setHasUploadedReport(false); setUploadedReportName(""); setReportAnalysis(null); }}
                      disabled={isAnalyzingReport}
                      data-testid="button-upload-another-report"
                    >
                      <Plus className="h-4 w-4" />
                      Upload Another
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {hasUploadedReport && (
              <div className="mt-6 text-center">
                <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-6">
                  {isAnalyzingReport ? (
                    <>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                        <p className="text-sm font-medium text-foreground">
                          AI is analyzing your data...
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">
                        Processing reports with GPT-4o-mini
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Please wait...</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">
                        {reportAnalysis?.success
                          ? "AI analysis complete! View your estimated profit/loss breakdown."
                          : "Report uploaded. Click below to view the dashboard."}
                      </p>
                      {reportAnalysis?.success && (
                        <p className="text-xs text-muted-foreground mb-4 flex items-center justify-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          All values marked with ~ are AI-generated estimates
                        </p>
                      )}
                      <Button 
                        className="gap-2 brand-gradient border-0 text-white" 
                        onClick={handleAnalyze} 
                        data-testid="button-view-analysis"
                      >
                        <Zap className="h-4 w-4" />
                        {reportAnalysis?.success 
                          ? "View AI Analysis" 
                          : "Analyze & View Dashboard"}
                      </Button>
                    </>
                  )}
                </Card>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Connected Platforms</h2>
              <Badge variant="secondary" className="gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" />
                Auto-Sync Enabled
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <Card 
                  key={platform.name}
                  className="backdrop-blur-xl border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] bg-white/70 dark:bg-card/70"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center text-2xl shadow-sm ${!platform.connected ? 'grayscale' : ''}`}>
                          {platform.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{platform.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {platform.connected ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      {platform.connected && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      )}
                    </div>
                    <Button 
                      variant={platform.connected ? "outline" : "default"}
                      className="w-full gap-2"
                      size="sm"
                      data-testid={`button-connect-${platform.name.toLowerCase()}`}
                    >
                      <Link2 className="h-4 w-4" />
                      {platform.connected ? "Manage" : "Connect"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Uploads;
