import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  FileWarning,
  WifiOff,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Globe
} from 'lucide-react';
import { ApiError } from '../types';

interface ErrorViewProps {
  error: ApiError;
  onRetry: () => void;
  onBack: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ error, onRetry, onBack }) => {
  const isNonHtml = error.code === 'NON_HTML';

  const getErrorIcon = () => {
    switch (error.code) {
      case 'INVALID_URL':
        return <AlertTriangle className="w-10 h-10 text-amber-500" />;
      case 'TIMEOUT':
        return <Clock className="w-10 h-10 text-rose-500" />;
      case 'NON_HTML':
        return <FileWarning className="w-10 h-10 text-amber-500" />;
      case 'NOT_FOUND':
        return <WifiOff className="w-10 h-10 text-rose-500" />;
      default:
        return <AlertTriangle className="w-10 h-10 text-rose-500" />;
    }
  };

  const getErrorHeadline = () => {
    switch (error.code) {
      case 'INVALID_URL':
        return 'Please enter a valid URL.';
      case 'TIMEOUT':
        return 'Connection timed out after 10 seconds.';
      case 'NON_HTML':
        return 'Unsupported Content Type';
      case 'NOT_FOUND':
        return 'Website Not Found';
      default:
        return error.error || 'Audit Request Failed';
    }
  };

  const getErrorDescription = () => {
    switch (error.code) {
      case 'NON_HTML':
        return 'This URL points to a resource that is not an HTML webpage. PagePulse can only audit HTML webpages.';
      case 'TIMEOUT':
        return 'The website took too long to respond.';
      default:
        return error.message;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto my-12 p-8 sm:p-10 bg-white border border-border rounded-2xl shadow-card text-center space-y-8"
    >
      {/* Visual Illustration Badge */}
      <div className="relative w-24 h-24 mx-auto rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
        {getErrorIcon()}
        {isNonHtml && (
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-amber-500 text-white font-mono text-[10px] font-extrabold rounded-md uppercase shadow-sm">
            PDF / Media
          </span>
        )}
      </div>

      {/* Main Error Copy */}
      <div className="space-y-2 max-w-lg mx-auto">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-accent tracking-tight">
          {getErrorHeadline()}
        </h3>
        <p className="text-sm text-accent-subtle leading-relaxed">
          {getErrorDescription()}
        </p>
      </div>

      {/* Examples Guidelines Box for Non-HTML Resources */}
      {isNonHtml && (
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-3">
          <p className="text-xs font-bold text-accent uppercase tracking-wider">
            Supported vs. Unsupported Resource Examples
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Website:</span>
                <code className="font-mono text-[11px]">https://openai.com</code>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Website:</span>
                <code className="font-mono text-[11px]">https://vercel.com</code>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium">PDF:</span>
                <code className="font-mono text-[11px]">dummy.pdf</code>
              </div>
              <div className="flex items-center gap-2 text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium">Image:</span>
                <code className="font-mono text-[11px]">logo.png</code>
              </div>
              <div className="flex items-center gap-2 text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium">JSON API:</span>
                <code className="font-mono text-[11px]">api.github.com</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onBack}
          className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-accent font-semibold text-sm rounded-xl transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <button
          onClick={onRetry}
          className="px-6 py-3 bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>{isNonHtml ? 'Analyze Another Website' : 'Try Again'}</span>
        </button>
      </div>
    </motion.div>
  );
};
