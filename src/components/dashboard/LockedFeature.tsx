import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface LockedFeatureProps {
  title: string;
  description: string;
  previewContent?: React.ReactNode;
}

const LockedFeature = ({ title, description, previewContent }: LockedFeatureProps) => {
  return (
    <div className="relative">
      {previewContent && (
        <div className="blur-sm opacity-50 pointer-events-none select-none">
          {previewContent}
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[2px] rounded-lg">
        <div className="text-center p-6 max-w-sm">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <Link to="/pricing">
            <Button className="gap-2 brand-gradient border-0 text-white" data-testid="button-unlock-feature">
              <Sparkles className="w-4 h-4" />
              Unlock Full Access
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LockedFeature;
