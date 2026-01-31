import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileSearch, 
  Tags, 
  Sparkles, 
  Brain, 
  CheckCircle2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AnalysisStep = 
  | "starting"
  | "ocr" 
  | "categorize" 
  | "gemini_analysis" 
  | "gpt_analysis" 
  | "cross_validation" 
  | "complete";

interface AnalysisProgressProps {
  currentStep: AnalysisStep;
  stepProgress?: number;
}

const steps = [
  { id: "starting", label: "Preparing Analysis", icon: FileSearch, description: "Initializing AI engines" },
  { id: "ocr", label: "Extracting Text", icon: FileSearch, description: "Reading document content with OCR" },
  { id: "categorize", label: "Categorizing", icon: Tags, description: "Detecting document types" },
  { id: "gemini_analysis", label: "Pattern Detection", icon: Sparkles, description: "Gemini AI finding patterns" },
  { id: "gpt_analysis", label: "Deep Analysis", icon: Brain, description: "GPT reasoning on findings" },
  { id: "cross_validation", label: "Cross-Validation", icon: CheckCircle2, description: "Verifying results" },
];

export function AnalysisProgress({ currentStep, stepProgress = 0 }: AnalysisProgressProps) {
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const isComplete = currentStep === "complete";
  
  const overallProgress = isComplete 
    ? 100 
    : ((currentStepIndex / steps.length) * 100) + ((stepProgress / 100) * (100 / steps.length));

  return (
    <Card className="border-border bg-card shadow-sm w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Overall Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-medium text-foreground">
                {isComplete ? "Analysis Complete" : "Analyzing..."}
              </span>
              <span className="text-muted-foreground">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="space-y-2 sm:space-y-3">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex || isComplete;
              const isPending = index > currentStepIndex && !isComplete;

              return (
                <div 
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg transition-all",
                    isActive && "bg-primary/5 border border-primary/20",
                    isCompleted && "opacity-60",
                    isPending && "opacity-40"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0",
                    isActive && "bg-primary text-primary-foreground",
                    isCompleted && "bg-green-500/20 text-green-600",
                    isPending && "bg-secondary text-muted-foreground"
                  )}>
                    {isActive ? (
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <StepIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      isActive && "text-foreground",
                      !isActive && "text-muted-foreground"
                    )}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                  {isActive && (
                    <span className="text-xs font-medium text-primary">
                      Processing...
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-xs font-medium text-green-600">
                      Done
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Model Indicators */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 pt-3 sm:pt-4 border-t border-border">
            <div className={cn(
              "flex items-center gap-1.5 sm:gap-2 text-xs",
              currentStep === "gemini_analysis" ? "text-primary font-medium" : "text-muted-foreground"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full",
                currentStepIndex >= 2 || isComplete ? "bg-green-500" : 
                currentStep === "gemini_analysis" ? "bg-primary animate-pulse" : "bg-muted"
              )} />
              Gemini
            </div>
            <div className={cn(
              "flex items-center gap-1.5 sm:gap-2 text-xs",
              currentStep === "gpt_analysis" ? "text-primary font-medium" : "text-muted-foreground"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full",
                currentStepIndex >= 3 || isComplete ? "bg-green-500" : 
                currentStep === "gpt_analysis" ? "bg-primary animate-pulse" : "bg-muted"
              )} />
              GPT
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AnalysisProgress;
