import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Heading,
  Image as ImageIcon,
  BookOpen,
  Copy,
  Check,
  Download,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AuditResult } from '../types';
import { MetricCard } from './MetricCard';

interface DashboardProps {
  result: AuditResult;
  onReAudit: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ result, onReAudit }) => {
  const [copied, setCopied] = useState(false);
  const [showH1List, setShowH1List] = useState(false);
  const [showMissingAltDetails, setShowMissingAltDetails] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pagepulse-audit-${new URL(result.url).hostname}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Response Time Classification
  // <200ms Green, 200-500ms Orange, >500ms Red
  let responseBadgeVariant: 'success' | 'warning' | 'danger' = 'success';
  let responseBadgeText = 'Fast (<200ms)';
  let responseColorClass = 'text-emerald-600';
  let responseProgressPercentage = Math.min(100, Math.max(10, Math.round((result.responseTime / 1000) * 100)));

  if (result.responseTime > 500) {
    responseBadgeVariant = 'danger';
    responseBadgeText = 'Slow (>500ms)';
    responseColorClass = 'text-rose-600';
  } else if (result.responseTime >= 200) {
    responseBadgeVariant = 'warning';
    responseBadgeText = 'Moderate (200-500ms)';
    responseColorClass = 'text-amber-600';
  }

  // HTTP Status Classification
  const isStatus2xx = result.status >= 200 && result.status < 300;
  const statusBadgeVariant: 'success' | 'warning' | 'danger' = isStatus2xx ? 'success' : result.status < 400 ? 'warning' : 'danger';

  // H1 Badge
  let h1BadgeVariant: 'success' | 'warning' | 'danger' = 'success';
  let h1BadgeText = 'Optimal (1 H1)';
  if (result.h1Count === 0) {
    h1BadgeVariant = 'danger';
    h1BadgeText = 'Missing H1 Tag';
  } else if (result.h1Count > 1) {
    h1BadgeVariant = 'warning';
    h1BadgeText = `Multiple H1s (${result.h1Count})`;
  }

  // Missing Alt Badge
  // 0 Green, >0 Orange
  const altBadgeVariant: 'success' | 'warning' = result.missingAltImages === 0 ? 'success' : 'warning';
  const altBadgeText = result.missingAltImages === 0 ? 'Perfect Alt Coverage' : `${result.missingAltImages} Missing Alt`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header Summary Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg uppercase tracking-wider">
              Audit Complete
            </span>
            <span className="text-xs text-accent-subtle font-mono">
              Audited at {new Date(result.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-accent tracking-tight flex items-center gap-3 break-all">
            <Globe className="w-6 h-6 text-primary shrink-0" />
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1.5"
            >
              {result.url}
              <ExternalLink className="w-4 h-4 text-accent-subtle opacity-70" />
            </a>
          </h2>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isStatus2xx ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {isStatus2xx ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              <span>{result.status} {result.statusText}</span>
            </div>

            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              responseBadgeVariant === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              responseBadgeVariant === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{result.responseTime} ms ({responseBadgeText})</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-accent text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-accent text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onReAudit}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Re-Audit Page</span>
          </button>
        </div>
      </motion.div>

      {/* 2-Column Responsive Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. HTTP Status Card */}
        <MetricCard
          icon={ShieldCheck}
          label="HTTP Status"
          value={
            <div className="flex items-center gap-3">
              <span className={isStatus2xx ? 'text-emerald-600' : 'text-rose-600'}>
                {result.status}
              </span>
              <span className="text-lg font-bold text-accent-subtle font-sans">
                {result.statusText}
              </span>
            </div>
          }
          badge={{
            text: isStatus2xx ? '200 Success' : `${result.status} Error`,
            variant: statusBadgeVariant
          }}
          description="The primary HTTP response status code delivered by the origin server upon receiving the audit GET request."
        />

        {/* 2. Response Time Card with Progress Meter */}
        <MetricCard
          icon={Zap}
          label="Response Time"
          value={
            <div className="flex items-baseline gap-2">
              <span className={responseColorClass}>{result.responseTime}</span>
              <span className="text-sm font-semibold text-accent-subtle">ms</span>
            </div>
          }
          badge={{
            text: responseBadgeText,
            variant: responseBadgeVariant
          }}
          description="Time required for the remote server to return the complete initial HTML document payload."
        >
          {/* Visual Latency Meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-accent-subtle font-medium">
              <span>Server Latency Meter</span>
              <span>{result.responseTime} ms</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  responseBadgeVariant === 'success' ? 'bg-emerald-500' :
                  responseBadgeVariant === 'warning' ? 'bg-amber-500' :
                  'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(10, (result.responseTime / 800) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 ms (Ideal)</span>
              <span>200 ms</span>
              <span>500 ms+</span>
            </div>
          </div>
        </MetricCard>

        {/* 3. Page Title Card */}
        <MetricCard
          icon={FileText}
          label="Page Title"
          value={
            <div className="text-base font-semibold text-accent leading-snug line-clamp-2">
              {result.title || <span className="text-rose-500 italic">No &lt;title&gt; tag found</span>}
            </div>
          }
          badge={{
            text: result.titleLength >= 30 && result.titleLength <= 60 ? 'Optimal Length' : `${result.titleLength} Chars`,
            variant: result.titleLength >= 30 && result.titleLength <= 60 ? 'success' : result.title ? 'warning' : 'danger'
          }}
          description="The HTML title tag specifies the title of a webpage for browser tabs and search engine result listings."
        >
          <div className="flex items-center justify-between text-xs text-accent-subtle">
            <span>Character Count: <strong className="text-accent">{result.titleLength}</strong></span>
            <span>Recommended: 50–60 chars</span>
          </div>
        </MetricCard>

        {/* 4. Meta Description Card */}
        <MetricCard
          icon={BookOpen}
          label="Meta Description"
          value={
            <div className="text-sm font-normal text-accent line-clamp-3 leading-relaxed">
              {result.metaDescription || <span className="text-rose-500 italic">No meta description specified</span>}
            </div>
          }
          badge={{
            text: result.metaDescription ? `${result.metaDescriptionLength} Chars` : 'Missing Tag',
            variant: result.metaDescription ? 'success' : 'danger'
          }}
          description="Provides a concise summary of the page for search engine result snippets."
        >
          <div className="flex items-center justify-between text-xs text-accent-subtle">
            <span>Character Count: <strong className="text-accent">{result.metaDescriptionLength}</strong></span>
            <span>Recommended: 120–160 chars</span>
          </div>
        </MetricCard>

        {/* 5. H1 Count Card */}
        <MetricCard
          icon={Heading}
          label="H1 Heading Count"
          value={
            <div className="flex items-center gap-2">
              <span>{result.h1Count}</span>
              <span className="text-xs font-normal text-accent-subtle">Primary Heading Tag(s)</span>
            </div>
          }
          badge={{
            text: h1BadgeText,
            variant: h1BadgeVariant
          }}
          description="HTML H1 headings define the main topic of a webpage. A page should contain exactly one H1 tag for search indexers."
        >
          {result.h1List.length > 0 && (
            <div className="space-y-2">
              <button
                onClick={() => setShowH1List(!showH1List)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>{showH1List ? 'Hide H1 Heading List' : 'View Detected H1 Headings'}</span>
                {showH1List ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showH1List && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-accent max-h-36 overflow-y-auto">
                  {result.h1List.map((h1, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 bg-primary/10 text-primary font-mono text-[10px] rounded font-bold">H1</span>
                      <span className="font-medium">{h1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </MetricCard>

        {/* 6. Missing Alt Images Card */}
        <MetricCard
          icon={ImageIcon}
          label="Images Missing Alt Text"
          value={
            <div className="flex items-baseline gap-2">
              <span className={result.missingAltImages === 0 ? 'text-emerald-600' : 'text-amber-600'}>
                {result.missingAltImages}
              </span>
              <span className="text-sm font-normal text-accent-subtle">
                out of {result.totalImages} images
              </span>
            </div>
          }
          badge={{
            text: altBadgeText,
            variant: altBadgeVariant
          }}
          description="Alt text describes images for screen readers and search crawlers, improving web accessibility and SEO compliance."
        >
          {result.missingAltDetails.length > 0 && (
            <div className="space-y-2">
              <button
                onClick={() => setShowMissingAltDetails(!showMissingAltDetails)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>{showMissingAltDetails ? 'Hide Missing Alt Images' : `Inspect ${result.missingAltDetails.length} Flagged Image(s)`}</span>
                {showMissingAltDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showMissingAltDetails && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-accent max-h-40 overflow-y-auto">
                  {result.missingAltDetails.map((img, i) => (
                    <div key={i} className="p-2 bg-white rounded-lg border border-slate-200 space-y-1">
                      <div className="font-mono text-[11px] text-accent font-medium truncate">
                        {img.src}
                      </div>
                      <div className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded inline-block">
                        Issue: {img.altText}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </MetricCard>

      </div>

      {/* 7. Full-Width Word Count & Content Depth Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-accent-subtle text-sm font-semibold">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Page Word Count & Content Depth</span>
          </div>
          <div className="text-3xl font-extrabold text-accent tracking-tight flex items-baseline gap-2">
            <span>{result.wordCount.toLocaleString()}</span>
            <span className="text-sm font-normal text-accent-subtle">Visible Words</span>
          </div>
          <p className="text-xs text-accent-subtle leading-relaxed">
            Calculated after removing non-content markup (scripts, styling, SVG elements). Higher word counts generally correlate with richer topical relevance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0">
          <div className="text-center px-4 border-r border-slate-200">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Content Depth</p>
            <p className="text-sm font-bold text-accent mt-0.5">{result.contentDepth}</p>
          </div>
          <div className="text-center px-4">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Est. Reading Time</p>
            <p className="text-sm font-bold text-primary mt-0.5">~{result.readingTimeMinutes} min</p>
          </div>
        </div>
      </motion.div>

    </div>
  );
};
