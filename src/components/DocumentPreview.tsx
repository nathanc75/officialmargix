import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Table2, 
  DollarSign, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  Eye,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface OCRResult {
  rawText: string;
  tables?: Array<{
    headers: string[];
    rows: string[][];
  }>;
  extractedData?: {
    amounts?: Array<{ value: number; description: string }>;
    dates?: string[];
    accountNumbers?: string[];
  };
  confidence: number;
}

interface DocumentPreviewProps {
  fileName: string;
  ocrResult: OCRResult;
  category?: string;
  className?: string;
}

export function DocumentPreview({ 
  fileName, 
  ocrResult, 
  category,
  className 
}: DocumentPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasExtractedData = ocrResult.extractedData && (
    (ocrResult.extractedData.amounts?.length ?? 0) > 0 ||
    (ocrResult.extractedData.dates?.length ?? 0) > 0 ||
    (ocrResult.extractedData.accountNumbers?.length ?? 0) > 0
  );

  const hasTables = ocrResult.tables && ocrResult.tables.length > 0;

  return (
    <Card className={cn("border-border bg-card", className)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">{fileName}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {category && (
                  <Badge variant="secondary" className="text-xs capitalize">
                    {category.replace("_", " ")}
                  </Badge>
                )}
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    ocrResult.confidence >= 0.8 
                      ? "text-green-600 border-green-600/20" 
                      : ocrResult.confidence >= 0.5
                        ? "text-amber-600 border-amber-600/20"
                        : "text-red-600 border-red-600/20"
                  )}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {Math.round(ocrResult.confidence * 100)}% confidence
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-1"
          >
            <Eye className="h-4 w-4" />
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <CardContent className="p-4 pt-2 space-y-4">
            {/* Extracted Data Summary */}
            {hasExtractedData && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Extracted Data
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ocrResult.extractedData?.amounts && ocrResult.extractedData.amounts.length > 0 && (
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-medium text-muted-foreground">
                          Amounts Found
                        </span>
                      </div>
                      <div className="space-y-1">
                        {ocrResult.extractedData.amounts.slice(0, 3).map((amount, idx) => (
                          <p key={idx} className="text-sm">
                            <span className="font-semibold text-foreground">
                              ${amount.value.toLocaleString()}
                            </span>
                            {amount.description && (
                              <span className="text-muted-foreground ml-1">
                                - {amount.description}
                              </span>
                            )}
                          </p>
                        ))}
                        {ocrResult.extractedData.amounts.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{ocrResult.extractedData.amounts.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {ocrResult.extractedData?.dates && ocrResult.extractedData.dates.length > 0 && (
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">
                          Dates Found
                        </span>
                      </div>
                      <div className="space-y-1">
                        {ocrResult.extractedData.dates.slice(0, 3).map((date, idx) => (
                          <p key={idx} className="text-sm text-foreground">{date}</p>
                        ))}
                        {ocrResult.extractedData.dates.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{ocrResult.extractedData.dates.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {ocrResult.extractedData?.accountNumbers && ocrResult.extractedData.accountNumbers.length > 0 && (
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Table2 className="h-4 w-4 text-amber-600" />
                        <span className="text-xs font-medium text-muted-foreground">
                          Account Numbers
                        </span>
                      </div>
                      <div className="space-y-1">
                        {ocrResult.extractedData.accountNumbers.slice(0, 2).map((acct, idx) => (
                          <p key={idx} className="text-sm text-foreground font-mono">
                            ****{acct.slice(-4)}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tables */}
            {hasTables && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Extracted Tables
                </h4>
                {ocrResult.tables?.slice(0, 2).map((table, tableIdx) => (
                  <div key={tableIdx} className="border border-border rounded-lg overflow-hidden">
                    <ScrollArea className="max-h-[200px]">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary/50">
                          <tr>
                            {table.headers.map((header, idx) => (
                              <th key={idx} className="px-3 py-2 text-left font-medium text-foreground">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {table.rows.slice(0, 5).map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-secondary/30">
                              {row.map((cell, cellIdx) => (
                                <td key={cellIdx} className="px-3 py-2 text-muted-foreground">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                    {table.rows.length > 5 && (
                      <div className="px-3 py-2 bg-secondary/30 text-xs text-muted-foreground text-center">
                        Showing 5 of {table.rows.length} rows
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Raw Text Preview */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Raw Text Preview
              </h4>
              <ScrollArea className="h-[120px] rounded-lg border border-border bg-secondary/30 p-3">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                  {ocrResult.rawText.slice(0, 1000)}
                  {ocrResult.rawText.length > 1000 && "..."}
                </pre>
              </ScrollArea>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default DocumentPreview;
