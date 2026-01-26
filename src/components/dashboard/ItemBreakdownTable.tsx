import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ItemBreakdownTableProps {
  isTrial?: boolean;
  hasData?: boolean;
}

const ItemBreakdownTable = ({ isTrial = false, hasData = false }: ItemBreakdownTableProps) => {
  if (!hasData) {
    return (
      <Card className="border shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold tracking-tight">Order Breakdown</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Detailed analysis of individual platform transactions</p>
            </div>
          </div>
          
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No Orders to Display</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Upload your delivery reports to see order-level profit analysis
            </p>
            <Link to="/uploads">
              <Button variant="outline" className="gap-2" data-testid="button-upload-for-orders">
                <Upload className="h-4 w-4" />
                Upload Reports
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // This would show the full table with real data when hasData is true
  return (
    <Card className="border shadow-sm bg-card overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold tracking-tight">Order Breakdown</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Detailed analysis of individual platform transactions</p>
          </div>
        </div>
        
        <div className="p-12 text-center">
          <p className="text-sm text-muted-foreground">Order data will appear here after AI analysis</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemBreakdownTable;
