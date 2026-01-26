import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText, CheckCircle2, Plus, Tag, Loader2, Zap, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import margixLogo from "@/assets/margix-logo.png";
import { useUpload } from "@/hooks/use-upload";

const Uploads = () => {
  const [hasUploadedReport, setHasUploadedReport] = useState(false);
  const [uploadedReportName, setUploadedReportName] = useState("");
  const [hasUploadedMenu, setHasUploadedMenu] = useState(false);
  const [uploadedMenuName, setUploadedMenuName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
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
      alert("Upload failed. Please try again.");
    },
  });

  const { uploadFile: uploadMenuFile, isUploading: isUploadingMenu, progress: menuProgress } = useUpload({
    onSuccess: async (response) => {
      await fetch("/api/uploads/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: response.metadata.name,
          objectPath: response.objectPath,
          size: response.metadata.size,
          contentType: response.metadata.contentType,
          type: "menu",
        }),
      });
      setUploadedMenuName(response.metadata.name);
      setHasUploadedMenu(true);
    },
    onError: (error) => {
      console.error("Menu upload failed:", error);
      alert("Upload failed. Please try again.");
    },
  });

  const handleReportSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadReportFile(file);
    }
  };

  const handleMenuSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadMenuFile(file);
    }
  };

  const handleAnalyze = () => {
    navigate("/dashboard");
  };
  
  const hasUploaded = hasUploadedReport || hasUploadedMenu;

  const platforms = [
    { name: "UberEats", icon: "🚗", connected: true, color: "bg-green-500" },
    { name: "DoorDash", icon: "🚪", connected: true, color: "bg-red-500" },
    { name: "Grubhub", icon: "🍔", connected: false, color: "bg-orange-500" },
    { name: "Postmates", icon: "📦", connected: false, color: "bg-purple-500" },
    { name: "Square POS", icon: "⬜", connected: false, color: "bg-slate-700" },
    { name: "Toast", icon: "🍞", connected: false, color: "bg-orange-600" },
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
                    <p className="text-xs sm:text-sm text-muted-foreground">Upload reports and menu screenshots</p>
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
            <div className="grid md:grid-cols-2 gap-6">
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
                        accept=".csv,.xlsx,.xls,.pdf"
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
                          : "CSV, Excel, PDF from Uber Eats, DoorDash, Grubhub"}
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
                    <div className="border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-6 text-center bg-emerald-50/50 dark:bg-emerald-900/10">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">Report uploaded</p>
                      <p className="text-xs text-muted-foreground mb-3 truncate max-w-[200px] mx-auto">{uploadedReportName}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-2" 
                        onClick={() => { setHasUploadedReport(false); setUploadedReportName(""); }}
                        data-testid="button-upload-another-report"
                      >
                        <Plus className="h-4 w-4" />
                        Upload Another
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Menu Screenshots</h3>
                  </div>
                  {!hasUploadedMenu ? (
                    <div 
                      className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                      onClick={() => menuInputRef.current?.click()}
                    >
                      <input
                        ref={menuInputRef}
                        type="file"
                        accept="image/*,.png,.jpg,.jpeg,.webp"
                        onChange={handleMenuSelect}
                        className="hidden"
                        data-testid="input-menu-upload"
                      />
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                        {isUploadingMenu ? (
                          <Loader2 className="h-6 w-6 text-primary animate-spin" />
                        ) : (
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        {isUploadingMenu ? "Uploading..." : "Drop menu images here"}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {isUploadingMenu 
                          ? `${menuProgress}%` 
                          : "Screenshots of your online menu with prices"}
                      </p>
                      <Button 
                        size="sm"
                        className="gap-2" 
                        onClick={(e) => { e.stopPropagation(); menuInputRef.current?.click(); }}
                        disabled={isUploadingMenu}
                        data-testid="button-browse-menu"
                      >
                        {isUploadingMenu ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        {isUploadingMenu ? "Uploading..." : "Browse Images"}
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-6 text-center bg-emerald-50/50 dark:bg-emerald-900/10">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">Menu uploaded</p>
                      <p className="text-xs text-muted-foreground mb-3 truncate max-w-[200px] mx-auto">{uploadedMenuName}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-2" 
                        onClick={() => { setHasUploadedMenu(false); setUploadedMenuName(""); }}
                        data-testid="button-upload-another-menu"
                      >
                        <Plus className="h-4 w-4" />
                        Upload Another
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {hasUploaded && (
              <div className="mt-6 text-center">
                <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    {hasUploadedReport && hasUploadedMenu 
                      ? "Great! Both your delivery reports and menu are ready for analysis."
                      : hasUploadedReport 
                        ? "Report uploaded! Add your menu screenshots for more accurate item-level estimates."
                        : "Menu uploaded! Add your delivery reports for a complete analysis."}
                  </p>
                  <Button 
                    className="gap-2 brand-gradient border-0 text-white" 
                    onClick={handleAnalyze} 
                    data-testid="button-view-analysis"
                  >
                    <Zap className="h-4 w-4" />
                    Analyze & View Dashboard
                  </Button>
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
