import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, Upload, FileText, Link2, CheckCircle2, Plus, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Tag, AlertTriangle, Percent, Clock, Lock, Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import margixLogo from "@/assets/margix-logo.png";
import { useUpload } from "@/hooks/use-upload";

interface PromoData {
  name: string;
  ordersUsed: number;
  totalDiscount: number;
  revenueGenerated: number;
  roi: number;
}

interface LossItem {
  name: string;
  lossAmount: number;
  reason: string;
}

interface UploadData {
  name: string;
  date: string;
  status: string;
  platform: string;
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalFees: number;
    netProfit: number;
    topItem: string;
    avgOrderValue: number;
    deliveryFees: number;
    serviceFees: number;
    refunds: number;
    peakHours: string;
  };
  promos: PromoData[];
  lossItems: LossItem[];
}

const UploadsAndPOS = () => {
  const [selectedUpload, setSelectedUpload] = useState<UploadData | null>(null);
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
    navigate("/trial");
  };
  
  const hasUploaded = hasUploadedReport || hasUploadedMenu;

  const platforms = [
    { name: "UberEats", icon: "🚗", connected: true, color: "bg-green-500" },
    { name: "DoorDash", icon: "🚪", connected: false, color: "bg-red-500" },
    { name: "Grubhub", icon: "🍔", connected: true, color: "bg-orange-500" },
    { name: "Postmates", icon: "📦", connected: false, color: "bg-purple-500" },
    { name: "Square POS", icon: "⬜", connected: false, color: "bg-slate-700" },
    { name: "Toast", icon: "🍞", connected: false, color: "bg-orange-600" },
  ];

  const recentUploads: UploadData[] = [
    { 
      name: "UberEats_Report_Jan2024.csv", 
      date: "2 hours ago", 
      status: "processed",
      platform: "UberEats",
      summary: {
        totalOrders: 847,
        totalRevenue: 12450.80,
        totalFees: 3112.70,
        netProfit: 9338.10,
        topItem: "Chicken Burrito Bowl",
        avgOrderValue: 14.70,
        deliveryFees: 1890.50,
        serviceFees: 1222.20,
        refunds: 245.30,
        peakHours: "6PM - 9PM"
      },
      promos: [
        { name: "20% Off First Order", ordersUsed: 156, totalDiscount: 892.40, revenueGenerated: 2890.50, roi: 2.24 },
        { name: "Free Delivery Weekend", ordersUsed: 89, totalDiscount: 445.00, revenueGenerated: 1456.80, roi: 2.27 },
        { name: "$5 Off $25+", ordersUsed: 45, totalDiscount: 225.00, revenueGenerated: 1245.00, roi: 4.53 }
      ],
      lossItems: [
        { name: "Large Loaded Nachos", lossAmount: 156.80, reason: "High ingredient cost + 30% discount" },
        { name: "Family Meal Deal", lossAmount: 89.50, reason: "Bundle pricing too aggressive" }
      ]
    },
    { 
      name: "DoorDash_Weekly_W3.xlsx", 
      date: "1 day ago", 
      status: "processed",
      platform: "DoorDash",
      summary: {
        totalOrders: 312,
        totalRevenue: 4890.25,
        totalFees: 1467.08,
        netProfit: 3423.17,
        topItem: "BBQ Pulled Pork Sandwich",
        avgOrderValue: 15.67,
        deliveryFees: 780.25,
        serviceFees: 686.83,
        refunds: 112.40,
        peakHours: "12PM - 2PM"
      },
      promos: [
        { name: "BOGO Tuesdays", ordersUsed: 67, totalDiscount: 534.60, revenueGenerated: 1245.80, roi: 1.33 },
        { name: "15% DashPass Discount", ordersUsed: 124, totalDiscount: 367.20, revenueGenerated: 2089.45, roi: 4.69 }
      ],
      lossItems: [
        { name: "Kids Meal Combo", lossAmount: 67.20, reason: "Low margin + free drink included" },
        { name: "Appetizer Sampler", lossAmount: 45.80, reason: "Portion size vs. price mismatch" },
        { name: "Happy Hour Wings", lossAmount: 34.10, reason: "Below-cost pricing during promo" }
      ]
    },
    { 
      name: "Grubhub_December.csv", 
      date: "3 days ago", 
      status: "processed",
      platform: "Grubhub",
      summary: {
        totalOrders: 1245,
        totalRevenue: 18920.50,
        totalFees: 5676.15,
        netProfit: 13244.35,
        topItem: "Margherita Pizza",
        avgOrderValue: 15.20,
        deliveryFees: 2890.30,
        serviceFees: 2785.85,
        refunds: 456.20,
        peakHours: "5PM - 8PM"
      },
      promos: [
        { name: "Holiday Special 25% Off", ordersUsed: 234, totalDiscount: 1456.80, revenueGenerated: 4567.90, roi: 2.14 },
        { name: "Free Appetizer $30+", ordersUsed: 178, totalDiscount: 890.00, revenueGenerated: 5890.50, roi: 5.62 },
        { name: "Loyalty Reward $10", ordersUsed: 89, totalDiscount: 890.00, revenueGenerated: 1678.90, roi: 0.89 }
      ],
      lossItems: [
        { name: "Truffle Fries", lossAmount: 234.50, reason: "Truffle oil cost spike + promo stacking" },
        { name: "Seafood Pasta", lossAmount: 178.90, reason: "Ingredient waste from low orders" }
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background elements matching dashboard */}
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
        {/* Header */}
        <header className="border-b border-border/50 bg-white/80 dark:bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                  <div className="w-8 h-8">
                    <img src={margixLogo} alt="MARGIX" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-foreground">Free Analysis</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">Upload your reports and menu screenshots</p>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-3 w-3" />
                Free Trial
              </Badge>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Upload Sections */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Upload Your Data</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Delivery Reports Upload */}
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

              {/* Menu Screenshots Upload */}
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

            {/* Analyze Button - Shows when at least one file is uploaded */}
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
                    <Sparkles className="h-4 w-4" />
                    View My Analysis
                  </Button>
                </Card>
              </div>
            )}
          </section>

          {/* Connect Platforms - Locked for Free Trial */}
          <section className="relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Connect Delivery Platforms</h2>
              <Badge variant="outline" className="gap-1 text-muted-foreground">
                <Lock className="h-3 w-3" />
                Upgrade Required
              </Badge>
            </div>
            
            {/* Locked overlay message */}
            <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Platform connections available on paid plans
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Upgrade to Starter or Pro to connect your delivery platforms for automatic, real-time data syncing. For your free analysis, upload a report above.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60 pointer-events-none">
              {platforms.map((platform) => (
                <Card 
                  key={platform.name}
                  className="backdrop-blur-xl border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] bg-white/70 dark:bg-card/70"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center text-2xl shadow-sm grayscale`}>
                          {platform.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{platform.name}</h3>
                          <p className="text-xs text-muted-foreground">Not connected</p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      className="w-full gap-2"
                      size="sm"
                      disabled
                    >
                      <Lock className="h-4 w-4" />
                      Locked
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Upload Summary Dialog */}
      <Dialog open={!!selectedUpload} onOpenChange={() => setSelectedUpload(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Report Summary
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              {selectedUpload?.name}
              <Badge variant="outline" className="ml-2">{selectedUpload?.platform}</Badge>
            </DialogDescription>
          </DialogHeader>
          
          {selectedUpload && (
            <div className="space-y-5">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <ShoppingBag className="h-3 w-3" />
                    Orders
                  </div>
                  <p className="text-lg font-bold text-foreground">{selectedUpload.summary.totalOrders.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <DollarSign className="h-3 w-3" />
                    Revenue
                  </div>
                  <p className="text-lg font-bold text-foreground">${selectedUpload.summary.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-50">
                  <div className="flex items-center gap-2 text-red-600 text-xs mb-1">
                    <TrendingDown className="h-3 w-3" />
                    Total Fees
                  </div>
                  <p className="text-lg font-bold text-red-600">-${selectedUpload.summary.totalFees.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50">
                  <div className="flex items-center gap-2 text-emerald-600 text-xs mb-1">
                    <TrendingUp className="h-3 w-3" />
                    Net Profit
                  </div>
                  <p className="text-lg font-bold text-emerald-600">${selectedUpload.summary.netProfit.toLocaleString()}</p>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="p-4 rounded-lg border border-border/50 bg-muted/30 space-y-3">
                <h4 className="font-medium text-foreground text-sm flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Fee Breakdown
                </h4>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center p-2 rounded bg-white/50">
                    <p className="text-muted-foreground text-xs">Delivery</p>
                    <p className="font-semibold text-red-600">-${selectedUpload.summary.deliveryFees.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 rounded bg-white/50">
                    <p className="text-muted-foreground text-xs">Service</p>
                    <p className="font-semibold text-red-600">-${selectedUpload.summary.serviceFees.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 rounded bg-white/50">
                    <p className="text-muted-foreground text-xs">Refunds</p>
                    <p className="font-semibold text-red-600">-${selectedUpload.summary.refunds.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Promos Section */}
              <div className="p-4 rounded-lg border border-border/50 bg-muted/30 space-y-3">
                <h4 className="font-medium text-foreground text-sm flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Promo Performance
                </h4>
                <div className="space-y-2">
                  {selectedUpload.promos.map((promo, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-white/50 text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{promo.name}</p>
                        <p className="text-xs text-muted-foreground">{promo.ordersUsed} orders used</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-600 text-xs">-${promo.totalDiscount.toLocaleString()} discount</p>
                        <p className="text-emerald-600 text-xs">+${promo.revenueGenerated.toLocaleString()} revenue</p>
                      </div>
                      <Badge 
                        variant={promo.roi >= 2 ? "default" : promo.roi >= 1 ? "secondary" : "destructive"}
                        className="ml-3"
                      >
                        {promo.roi.toFixed(1)}x ROI
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loss Items Section */}
              <div className="p-4 rounded-lg border border-red-200 bg-red-50/50 space-y-3">
                <h4 className="font-medium text-red-700 text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Items Losing Money
                </h4>
                <div className="space-y-2">
                  {selectedUpload.lossItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-white/70 text-sm">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.reason}</p>
                      </div>
                      <p className="font-bold text-red-600">-${item.lossAmount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Insights */}
              <div className="p-4 rounded-lg border border-border/50 bg-muted/30 space-y-3">
                <h4 className="font-medium text-foreground text-sm">Quick Insights</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between p-2 rounded bg-white/50">
                    <span className="text-muted-foreground">Top Seller</span>
                    <span className="font-medium text-foreground">{selectedUpload.summary.topItem}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white/50">
                    <span className="text-muted-foreground">Avg Order</span>
                    <span className="font-medium text-foreground">${selectedUpload.summary.avgOrderValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white/50">
                    <span className="text-muted-foreground">Fee %</span>
                    <span className="font-medium text-red-600">{((selectedUpload.summary.totalFees / selectedUpload.summary.totalRevenue) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white/50">
                    <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Peak</span>
                    <span className="font-medium text-foreground">{selectedUpload.summary.peakHours}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                View Full Report
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadsAndPOS;
