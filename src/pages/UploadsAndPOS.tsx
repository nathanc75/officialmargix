import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, Upload, FileText, Link2, CheckCircle2, Plus, TrendingUp, TrendingDown, DollarSign, ShoppingBag } from "lucide-react";

interface UploadData {
  name: string;
  date: string;
  status: string;
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalFees: number;
    netProfit: number;
    topItem: string;
    avgOrderValue: number;
  };
}

const UploadsAndPOS = () => {
  const [selectedUpload, setSelectedUpload] = useState<UploadData | null>(null);

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
      summary: {
        totalOrders: 847,
        totalRevenue: 12450.80,
        totalFees: 3112.70,
        netProfit: 9338.10,
        topItem: "Chicken Burrito Bowl",
        avgOrderValue: 14.70
      }
    },
    { 
      name: "DoorDash_Weekly_W3.xlsx", 
      date: "1 day ago", 
      status: "processed",
      summary: {
        totalOrders: 312,
        totalRevenue: 4890.25,
        totalFees: 1467.08,
        netProfit: 3423.17,
        topItem: "BBQ Pulled Pork Sandwich",
        avgOrderValue: 15.67
      }
    },
    { 
      name: "Grubhub_December.csv", 
      date: "3 days ago", 
      status: "processed",
      summary: {
        totalOrders: 1245,
        totalRevenue: 18920.50,
        totalFees: 5676.15,
        netProfit: 13244.35,
        topItem: "Margherita Pizza",
        avgOrderValue: 15.20
      }
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
        <header className="border-b border-border/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Uploads & POS</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Manage your data sources and integrations</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Upload Section */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Upload Reports</h2>
            <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6 sm:p-8">
                <div className="border-2 border-dashed border-border rounded-xl p-8 sm:p-12 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Drop your files here</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Support for CSV, Excel, and PDF reports from any delivery platform
                  </p>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Browse Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Recent Uploads */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Uploads</h2>
            <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  {recentUploads.map((file, index) => (
                    <div 
                      key={index}
                      onClick={() => setSelectedUpload(file)}
                      className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm sm:text-base">{file.name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{file.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs sm:text-sm font-medium capitalize hidden sm:inline">{file.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Connect Platforms */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Connect Delivery Platforms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <Card 
                  key={platform.name}
                  className={`backdrop-blur-xl border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 ${
                    platform.connected ? 'bg-emerald-50/50 ring-2 ring-emerald-500/30' : 'bg-white/70'
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center text-2xl shadow-sm`}>
                          {platform.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{platform.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {platform.connected ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant={platform.connected ? "outline" : "default"}
                      className="w-full gap-2"
                      size="sm"
                    >
                      {platform.connected ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Manage
                        </>
                      ) : (
                        <>
                          <Link2 className="h-4 w-4" />
                          Connect
                        </>
                      )}
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Report Summary
            </DialogTitle>
            <DialogDescription>{selectedUpload?.name}</DialogDescription>
          </DialogHeader>
          
          {selectedUpload && (
            <div className="space-y-4">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <ShoppingBag className="h-3 w-3" />
                    Total Orders
                  </div>
                  <p className="text-lg font-bold text-foreground">{selectedUpload.summary.totalOrders.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <DollarSign className="h-3 w-3" />
                    Total Revenue
                  </div>
                  <p className="text-lg font-bold text-foreground">${selectedUpload.summary.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-50">
                  <div className="flex items-center gap-2 text-red-600 text-xs mb-1">
                    <TrendingDown className="h-3 w-3" />
                    Platform Fees
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

              {/* Additional Insights */}
              <div className="p-4 rounded-lg border border-border/50 bg-muted/30 space-y-3">
                <h4 className="font-medium text-foreground text-sm">Quick Insights</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Top Selling Item</span>
                    <span className="font-medium text-foreground">{selectedUpload.summary.topItem}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Order Value</span>
                    <span className="font-medium text-foreground">${selectedUpload.summary.avgOrderValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee Percentage</span>
                    <span className="font-medium text-red-600">{((selectedUpload.summary.totalFees / selectedUpload.summary.totalRevenue) * 100).toFixed(1)}%</span>
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
