import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'danger' | 'info';
  };
  description: string;
  whyItMatters?: string;
  recommendation?: string;
  currentStatus?: string;
  children?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  badge,
  description,
  whyItMatters,
  recommendation,
  currentStatus,
  children,
}) => {
  const badgeStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group space-y-4"
    >
      <div>
        {/* Card Header: Icon, Label, Badge */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-primary-light flex items-center justify-center text-slate-700 group-hover:text-primary transition-colors">
              <Icon className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm text-accent-subtle tracking-tight">
              {label}
            </span>
          </div>

          {badge && (
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                badgeStyles[badge.variant]
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>

        {/* Main Metric Value */}
        <div className="text-2xl sm:text-3xl font-extrabold text-accent tracking-tight my-2">
          {value}
        </div>

        {/* Short Description */}
        <p className="text-xs text-accent-subtle leading-relaxed mb-3">
          {description}
        </p>

        {/* Status Pill & Why It Matters Box */}
        {(whyItMatters || currentStatus || recommendation) && (
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs text-slate-700">
            {currentStatus && (
              <div className="flex items-center gap-1.5 font-bold text-accent">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span>Status: {currentStatus}</span>
              </div>
            )}
            {whyItMatters && (
              <p className="text-[11px] text-accent-subtle leading-relaxed">
                <strong className="text-accent font-semibold">Why it matters:</strong> {whyItMatters}
              </p>
            )}
            {recommendation && (
              <div className="pt-1.5 border-t border-slate-200 text-[11px] text-primary font-medium flex items-start gap-1">
                <Sparkles className="w-3 h-3 shrink-0 mt-0.5" />
                <span><strong>Recommendation:</strong> {recommendation}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Optional Custom Interactive Content */}
      {children && (
        <div className="pt-2 border-t border-slate-100">
          {children}
        </div>
      )}
    </motion.div>
  );
};
