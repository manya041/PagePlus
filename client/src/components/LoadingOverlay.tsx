import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Globe, FileCode, BarChart3 } from 'lucide-react';
import { AnalysisStep } from '../types';

interface LoadingOverlayProps {
  step: AnalysisStep;
  targetUrl: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ step, targetUrl }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Auto-progress through simulated visual steps for premium SaaS feel
  useEffect(() => {
    if (step === 'fetching') {
      setCurrentStepIndex(0);
    } else if (step === 'parsing') {
      setCurrentStepIndex(1);
    } else if (step === 'generating') {
      setCurrentStepIndex(2);
    }
  }, [step]);

  const stepsList = [
    { label: 'Fetching page HTTP payload...', desc: 'Initiating HTTP request & measuring response latency', icon: Globe },
    { label: 'Parsing HTML structure...', desc: 'Extracting titles, meta tags, H1 hierarchy & image alt attributes', icon: FileCode },
    { label: 'Generating audit report...', desc: 'Computing accessibility scores and content word metrics', icon: BarChart3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-xl mx-auto my-12 p-8 bg-white border border-border rounded-2xl shadow-card text-center relative overflow-hidden"
    >
      {/* Top Animated Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: '0%' }}
          animate={{
            width: currentStepIndex === 0 ? '35%' : currentStepIndex === 1 ? '70%' : '100%'
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </div>

      {/* Main Spinner Ring */}
      <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>

      <h3 className="text-xl font-bold text-accent tracking-tight">
        Auditing Webpage
      </h3>
      
      <p className="mt-1 text-sm text-accent-subtle font-mono truncate max-w-md mx-auto">
        {targetUrl}
      </p>

      {/* Step Indicators */}
      <div className="mt-8 space-y-3.5 text-left">
        {stepsList.map((s, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const StepIcon = s.icon;

          return (
            <div
              key={s.label}
              className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all duration-200 ${
                isCurrent
                  ? 'bg-primary-light/50 border-primary/30 text-accent'
                  : isDone
                  ? 'bg-emerald-50/50 border-emerald-200 text-slate-700'
                  : 'bg-slate-50/50 border-border text-slate-400 opacity-60'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <StepIcon className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold tracking-tight">
                  {s.label}
                </p>
                <p className="text-xs text-accent-subtle mt-0.5">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
