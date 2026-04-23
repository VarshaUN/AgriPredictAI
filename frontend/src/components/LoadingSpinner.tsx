import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullPage = false, text = "Loading..." }: { fullPage?: boolean; text?: string }) => {
  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{text}</p>
        </div>
      </div>
    );
  }
  return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
};

export default LoadingSpinner;
