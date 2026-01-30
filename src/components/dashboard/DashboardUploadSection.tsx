import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, CheckCircle2, Plus, Loader2, Brain, Sparkles } from "lucide-react";
import { useUpload } from "@/hooks/use-upload";
import { useAnalysis } from "@/context/AnalysisContext";
import { useToast } from "@/hooks/use-toast";

const DashboardUploadSection = () => {
  const [hasUploadedReport, setHasUploadedReport] = useState(false);
  const [uploadedReportName, setUploadedReportName] = useState("");
  const [reportFileContent, setReportFileContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { analyzeReport, isAnalyzing, analysisStep } = useAnalysis();

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
    },
    onError: (error) => {
      console.error("Report upload failed:", error);
      toast({
        title: "Upload Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleReportSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      setReportFileContent(text);
      await uploadReportFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!reportFileContent) {
      toast({
        title: "No Report",
        description: "Please upload a delivery report to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    const reportResult = await analyzeReport(reportFileContent, "delivery");
    
    if (!reportResult) {
      toast({
        title: "Analysis Failed",
        description: "We couldn't analyze your report. Please try again or upload a different file.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Analysis Complete",
      description: "Your data has been analyzed. View your insights below.",
    });
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Upload Your Data</h2>
      </div>
      
      <Card className="border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Financial Documents</h3>
          </div>
          
          {!hasUploadedReport ? (
            <div 
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.pdf"
                onChange={handleReportSelect}
                className="hidden"
                data-testid="input-file-upload"
              />
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                {isUploadingReport ? (
                  <Loader2 className="h-7 w-7 text-primary animate-spin" />
                ) : (
                  <Upload className="h-7 w-7 text-muted-foreground" />
                )}
              </div>
              <p className="text-base font-medium text-foreground mb-1">
                {isUploadingReport ? "Uploading..." : "Drop files here or click to browse"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {isUploadingReport 
                  ? `${reportProgress}%` 
                  : "CSV, Excel, or PDF financial documents"}
              </p>
              <Button 
                size="default"
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
            <div className="space-y-4">
              <div className="border-2 border-emerald-200 rounded-xl p-6 text-center bg-emerald-50/50">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Document uploaded</p>
                <p className="text-xs text-muted-foreground mb-3 truncate max-w-[200px] mx-auto">{uploadedReportName}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-2" 
                  onClick={() => { setHasUploadedReport(false); setUploadedReportName(""); setReportFileContent(""); }}
                  data-testid="button-upload-another-report"
                >
                  <Plus className="h-4 w-4" />
                  Upload Another
                </Button>
              </div>
              
              {/* Analyze Button */}
              <Card className="border-primary/20 bg-primary/5 p-6">
                {isAnalyzing ? (
                  <>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Brain className="h-6 w-6 text-primary animate-pulse" />
                      <p className="text-sm font-medium text-foreground">{analysisStep || "Analyzing your data..."}</p>
                    </div>
                    <div className="w-full max-w-xs mx-auto h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-pulse w-3/4 rounded-full"></div>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Your document is ready for analysis. Click below to get AI-powered insights.
                    </p>
                    <Button 
                      className="gap-2 brand-gradient border-0 text-white" 
                      onClick={handleAnalyze} 
                      disabled={isAnalyzing}
                      data-testid="button-view-analysis"
                    >
                      <Sparkles className="h-4 w-4" />
                      Analyze My Data
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default DashboardUploadSection;
