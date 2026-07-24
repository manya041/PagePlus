import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';
import { AuditResult } from '../types';

interface SmartRecommendationsProps {
  result: AuditResult;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ result }) => {
  const recommendations: Array<{ title: string; desc: string; type: 'warning' | 'danger' | 'info' }> = [];

  // 1. Meta Description Check
  if (!result.metaDescription) {
    recommendations.push({
      title: 'Missing Meta Description',
      desc: 'Add a concise meta description tag between 120–160 characters to improve search engine click-through rates.',
      type: 'danger'
    });
  } else if (result.metaDescriptionLength < 120 || result.metaDescriptionLength > 160) {
    recommendations.push({
      title: 'Suboptimal Meta Description Length',
      desc: `Current meta description is ${result.metaDescriptionLength} characters. Target 120–160 characters for optimal snippet display.`,
      type: 'warning'
    });
  }

  // 2. Title Tag Check
  if (!result.title) {
    recommendations.push({
      title: 'Missing Page Title Tag',
      desc: 'Add a descriptive <title> tag between 50–60 characters to help search crawlers index your page.',
      type: 'danger'
    });
  } else if (result.titleLength < 30 || result.titleLength > 60) {
    recommendations.push({
      title: 'Optimize Title Tag Length',
      desc: `Current page title length is ${result.titleLength} characters. Recommended length is 50–60 characters.`,
      type: 'warning'
    });
  }

  // 3. H1 Heading Check
  if (result.h1Count === 0) {
    recommendations.push({
      title: 'Missing H1 Heading',
      desc: 'Add exactly one <h1> heading element to establish clear document topic hierarchy.',
      type: 'danger'
    });
  } else if (result.h1Count > 1) {
    recommendations.push({
      title: 'Multiple H1 Tags Detected',
      desc: `Found ${result.h1Count} H1 tags. Best practice is to use exactly one <h1> tag per webpage.`,
      type: 'warning'
    });
  }

  // 4. Missing Alt Text Check
  if (result.missingAltImages > 0) {
    recommendations.push({
      title: 'Images Missing Alt Attributes',
      desc: `Add descriptive alt text to all ${result.missingAltImages} flagged image tag(s) for screen reader accessibility compliance.`,
      type: 'warning'
    });
  }

  // 5. Response Time Check
  if (result.responseTime > 200) {
    recommendations.push({
      title: 'Improve Server Response Latency',
      desc: `Origin server took ${result.responseTime}ms to respond. Optimize backend database queries, TTFB, and server caching to achieve under 200ms latency.`,
      type: result.responseTime > 500 ? 'danger' : 'warning'
    });
  }

  // 6. Word Count Check
  if (result.wordCount < 300) {
    recommendations.push({
      title: 'Low Visible Word Density',
      desc: `Extracted ${result.wordCount} words. Consider expanding textual content to improve topical depth score.`,
      type: 'info'
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-card space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-accent tracking-tight">Smart Actionable Recommendations</h3>
            <p className="text-xs text-accent-subtle">Automated optimization suggestions generated from your audit results</p>
          </div>
        </div>

        <span className="px-3 py-1 bg-slate-100 text-accent font-semibold text-xs rounded-full">
          {recommendations.length} {recommendations.length === 1 ? 'Suggestion' : 'Suggestions'}
        </span>
      </div>

      {recommendations.length === 0 ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Great job! No critical SEO, accessibility, or performance issues detected.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                rec.type === 'danger'
                  ? 'bg-rose-50/60 border-rose-200 text-rose-900'
                  : rec.type === 'warning'
                  ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                  : 'bg-blue-50/60 border-blue-200 text-blue-900'
              }`}
            >
              <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                rec.type === 'danger' ? 'text-rose-600' : rec.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
              }`} />
              <div className="space-y-1">
                <h4 className="text-sm font-bold tracking-tight">{rec.title}</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{rec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
