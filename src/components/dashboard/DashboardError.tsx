import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Display/Card';
import { EmptyState } from '@/components/ui/Display/EmptyState';

export interface DashboardErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onNavigateHome?: () => void;
  error?: Error | string;
}

/**
 * Error state component for dashboard errors
 */
export const DashboardError: React.FC<DashboardErrorProps> = ({
  title = 'Dashboard Error',
  message = 'Failed to load the dashboard. Please try again.',
  onRetry,
  onNavigateHome,
  error,
}) => {
  const isDevMode = import.meta.env.DEV;

  return (
    <div className="space-y-6">
      {/* Main Error Card */}
      <Card className="border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-300 mb-1">
                {title}
              </h3>
              <p className="text-sm text-rose-700 dark:text-rose-400 mb-4">{message}</p>

              {/* Dev Mode Error Details */}
              {isDevMode && error && (
                <details className="mt-4 pt-4 border-t border-rose-200 dark:border-rose-900/50">
                  <summary className="text-xs font-mono text-rose-600 dark:text-rose-400 cursor-pointer hover:opacity-75">
                    Error Details (Dev Mode)
                  </summary>
                  <pre className="mt-2 p-2 bg-slate-900/50 rounded text-xs text-slate-300 overflow-auto max-h-40">
                    {typeof error === 'string' ? error : error.message}
                  </pre>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </button>
                )}
                {onNavigateHome && (
                  <button
                    onClick={onNavigateHome}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    Go Home
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting Tips */}
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardContent className="pt-6">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Troubleshooting Tips
          </h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex gap-2">
              <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
              <span>Try refreshing the page</span>
            </li>
            <li className="flex gap-2">
              <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
              <span>Check your internet connection</span>
            </li>
            <li className="flex gap-2">
              <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
              <span>Clear your browser cache and cookies</span>
            </li>
            <li className="flex gap-2">
              <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
              <span>Try using a different browser</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Empty state component for dashboard when no data is available
 */
export const DashboardEmpty: React.FC<{ onAction?: () => void }> = ({ onAction }) => {
  return (
    <EmptyState
      icon={<AlertCircle className="h-6 w-6" />}
      title="No Dashboard Data"
      description="Start by creating your first project to see your dashboard come to life."
      action={
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
        >
          Create Project
        </button>
      }
    />
  );
};
