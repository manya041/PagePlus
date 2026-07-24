import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, FileWarning, WifiOff, RotateCcw, ArrowLeft } from 'lucide-react';
import { ApiError } from '../types';

interface ErrorViewProps {
  error: ApiError;
  onRetry: () => void;
  onBack: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ error, onRetry, onBack }) => {
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
        return 'This URL points to a PDF, image or other non-HTML resource which cannot be audited.';
      case 'TIMEOUT':
        return 'The website took too long to respond.';
      default:
        return error.message;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto my-12 p-8 bg-white border border-border rounded-2xl shadow-card text-center space-y-6"
    >
      {/* Icon Badge */}
      <div className="w-20 h-20 mx-auto rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
        {getErrorIcon()}
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-extrabold text-accent tracking-tight">
          {getErrorHeadline()}
        </h3>
        <p className="text-sm text-accent-subtle leading-relaxed max-w-md mx-auto">
          {getErrorDescription()}
        </p>
      </div>

      {/* Action buttons */}
      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-accent font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </motion.div>
  );
};
