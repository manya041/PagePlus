import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, TrendingUp, AlertCircle } from 'lucide-react';
import { AuditResult } from '../types';

interface HealthScoreProps {
  result: AuditResult;
}

export const HealthScore: React.FC<HealthScoreProps> = ({ result }) => {
  // Score Calculation Algorithm
  let httpScore = 0;
  if (result.status >= 200 && result.status < 300) httpScore = 20;
  else if (result.status >= 300 && result.status < 400) httpScore = 15;

  let perfScore = 5;
  if (result.responseTime < 200) perfScore = 20;
  else if (result.responseTime <= 500) perfScore = 12;

  let seoScore = 0;
  if (result.title) seoScore += 10;
  if (result.titleLength >= 30 && result.titleLength <= 60) seoScore += 5;
  if (result.metaDescription) seoScore += 5;

  let h1Score = 0;
  if (result.h1Count === 1) h1Score = 20;
  else if (result.h1Count > 1) h1Score = 10;

  let accessScore = 20;
  if (result.totalImages > 0) {
    const missingRatio = result.missingAltImages / result.totalImages;
    accessScore = Math.max(0, Math.round(20 * (1 - missingRatio)));
  }

  const totalScore = Math.min(100, Math.max(0, httpScore + perfScore + seoScore + h1Score + accessScore));

  let grade = 'A+';
  let label = 'Excellent';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let ringColor = '#10B981';

  if (totalScore < 50) {
    grade = 'F';
    label = 'Poor';
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
    ringColor = '#EF4444';
  } else if (totalScore < 75) {
    grade = 'C';
    label = 'Needs Improvement';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    ringColor = '#F59E0B';
  } else if (totalScore < 90) {
    grade = 'A';
    label = 'Good';
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
    ringColor = '#2563EB';
  }

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-8"
    >
      {/* Left Text & Grade Badge */}
      <div className="space-y-3 text-center md:text-left flex-1">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Website Health Score
          </span>
          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${badgeColor}`}>
            Grade {grade} • {label}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-accent tracking-tight">
          Overall Health Index: <span className="text-primary">{totalScore}/100</span>
        </h3>

        <p className="text-xs sm:text-sm text-accent-subtle leading-relaxed max-w-xl">
          Computed across HTTP response status, document latency, search title & meta tags, heading hierarchy, and image alt accessibility.
        </p>

        {/* Category Score Breakdown Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-[11px] font-semibold text-accent-subtle">
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <span className="block text-slate-400 font-mono text-[10px]">Status</span>
            <span className="text-slate-800 font-bold">{httpScore}/20</span>
          </div>
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <span className="block text-slate-400 font-mono text-[10px]">Latency</span>
            <span className="text-slate-800 font-bold">{perfScore}/20</span>
          </div>
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <span className="block text-slate-400 font-mono text-[10px]">SEO Meta</span>
            <span className="text-slate-800 font-bold">{seoScore}/20</span>
          </div>
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <span className="block text-slate-400 font-mono text-[10px]">H1 Tag</span>
            <span className="text-slate-800 font-bold">{h1Score}/20</span>
          </div>
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <span className="block text-slate-400 font-mono text-[10px]">Alt Text</span>
            <span className="text-slate-800 font-bold">{accessScore}/20</span>
          </div>
        </div>
      </div>

      {/* Right Animated Circular Progress Ring */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="10"
            fill="transparent"
          />
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            stroke={ringColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-accent tracking-tight leading-none">
            {totalScore}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            / 100
          </span>
        </div>
      </div>
    </motion.div>
  );
};
