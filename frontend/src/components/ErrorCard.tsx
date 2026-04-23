import { AlertTriangle } from 'lucide-react';

interface ErrorCardProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorCard = ({ message = "Something went wrong.", onRetry }: ErrorCardProps) => (
  <div className="rounded-card border-l-4 border-destructive bg-red-50 p-6 shadow-card">
    <div className="flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium text-gray-900">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 rounded-button border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-red-50 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ErrorCard;
