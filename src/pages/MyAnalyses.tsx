import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  Trash2,
  Eye,
  FileText,
  Loader2
} from "lucide-react";
import { useGoBack } from "@/hooks/useGoBack";
import { useSavedAnalyses, SavedAnalysis } from "@/hooks/useSavedAnalyses";
import { useAnalysis } from "@/context/AnalysisContext";
import { useUser } from "@/context/UserContext";
import margixLogo from "@/assets/margix-logo.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const MyAnalyses = () => {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const { user } = useUser();
  const { analyses, isLoading, fetchAnalyses, deleteAnalysis } = useSavedAnalyses();
  const { loadSavedAnalysis } = useAnalysis();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/signin?redirect=/my-analyses");
      return;
    }
    fetchAnalyses();
  }, [user, navigate, fetchAnalyses]);

  const handleViewAnalysis = (analysis: SavedAnalysis) => {
    loadSavedAnalysis({
      totalLeaks: analysis.total_leaks,
      totalRecoverable: analysis.total_recoverable,
      totalAmountDue: 0, // Saved analyses don't have expense data yet
      expenses: [], // Saved analyses don't have expense data yet
      leaks: analysis.leaks,
      summary: analysis.summary || "",
      analyzedAt: analysis.analyzed_at,
      confidence: analysis.confidence || undefined,
    });
    navigate("/results");
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteAnalysis(id);
    setDeletingId(null);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/[0.02] blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.015] blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-muted-foreground hover:text-foreground"
                  onClick={goBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                <div className="h-5 w-px bg-border/60" />
                <Link to="/" className="flex items-center gap-2.5">
                  <img src={margixLogo} alt="MARGIX" className="w-7 h-7" />
                  <div>
                    <h1 className="text-base font-semibold text-foreground tracking-tight">My Analyses</h1>
                  </div>
                </Link>
              </div>
              <Button 
                size="sm" 
                className="gap-2 brand-gradient border-0 text-white"
                onClick={() => navigate("/dashboard")}
              >
                New Scan
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : analyses.length === 0 ? (
            <Card className="border-border/40 shadow-soft">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No saved analyses yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Run a leak scan and save it to see your analysis history here.
                </p>
                <Button 
                  className="brand-gradient border-0 text-white"
                  onClick={() => navigate("/dashboard")}
                >
                  Start Your First Scan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {analyses.length} saved {analyses.length === 1 ? 'analysis' : 'analyses'}
                </p>
              </div>

              {analyses.map((analysis, index) => (
                <Card 
                  key={analysis.id} 
                  className="border-border/40 shadow-soft hover:shadow-md transition-shadow animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground truncate">
                            {analysis.title}
                          </h3>
                          <Badge variant="secondary" className="shrink-0">
                            {analysis.total_leaks} {analysis.total_leaks === 1 ? 'issue' : 'issues'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(analysis.analyzed_at)}
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                            <DollarSign className="h-3.5 w-3.5" />
                            {formatCurrency(analysis.total_recoverable)} recoverable
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleViewAnalysis(analysis)}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              disabled={deletingId === analysis.id}
                            >
                              {deletingId === analysis.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete analysis?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete "{analysis.title}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(analysis.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyAnalyses;
