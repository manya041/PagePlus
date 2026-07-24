import React from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  ArrowRight,
  Server,
  FileCode,
  BarChart2,
  CheckCircle2,
  Zap,
  Search,
  ShieldCheck,
  BookOpen,
  Activity,
  AlertTriangle,
  Clock,
  FileWarning,
  WifiOff
} from 'lucide-react';

export const DocsSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Enter Webpage URL',
      desc: 'User inputs any HTTP/HTTPS web address into the search input bar.',
      icon: Globe
    },
    {
      step: '02',
      title: 'Backend Fetching',
      desc: 'PagePulse server performs a fast GET request and measures precise latency.',
      icon: Server
    },
    {
      step: '03',
      title: 'Cheerio HTML Parsing',
      desc: 'Strips noise scripts/styles, extracts titles, meta tags, H1s & image alt attributes.',
      icon: FileCode
    },
    {
      step: '04',
      title: 'Metrics Generation',
      desc: 'Calculates SEO health indicators, accessibility ratios & content depth ratings.',
      icon: BarChart2
    },
    {
      step: '05',
      title: 'Interactive Dashboard',
      desc: 'Presents a 2-column SaaS dashboard with export actions and status badges.',
      icon: CheckCircle2
    }
  ];

  const analysisTypes = [
    { title: 'HTTP Status', desc: 'Inspects origin server status codes (200 OK, 301, 404, 500).', icon: Activity, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { title: 'Response Time', desc: 'Measures total request latency with speed thresholds (<200ms Fast, >500ms Slow).', icon: Zap, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { title: 'SEO Metadata', desc: 'Validates title tags and meta descriptions against search engine guidelines.', icon: Search, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { title: 'Accessibility', desc: 'Identifies missing alt attributes on images for screen reader accessibility compliance.', icon: ShieldCheck, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { title: 'Content Analysis', desc: 'Computes visible word count, estimated reading duration, and topic depth score.', icon: BookOpen, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' }
  ];

  const errorHandlingCases = [
    { title: 'Invalid URL', msg: 'Rejects malformed domains and missing protocols cleanly.', icon: AlertTriangle, status: '400 Bad Request' },
    { title: 'Connection Timeout', msg: 'Triggers a timeout error if origin server takes >10 seconds.', icon: Clock, status: '504 Gateway Timeout' },
    { title: 'Unsupported Content Type', msg: 'Rejects PDFs, direct images, or JSON API links.', icon: FileWarning, status: '400 Unsupported Type' },
    { title: 'Website Not Found / Unreachable', msg: 'Catches unreachable domains or 404 targets without server crash.', icon: WifiOff, status: '502 / 404 Error' }
  ];

  return (
    <section id="docs" className="py-16 md:py-24 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
            Engine Documentation
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-accent tracking-tight">
            How PagePulse Auditing Works
          </h2>
          <p className="text-accent-subtle text-base sm:text-lg">
            Understand the step-by-step lifecycle from URL input to full report delivery.
          </p>
        </div>

        {/* 5-Step Process Timeline Cards */}
        <div>
          <h3 className="text-xl font-bold text-accent tracking-tight mb-8 text-center sm:text-left">
            Execution Lifecycle
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((s, idx) => {
              const StepIcon = s.icon;
              return (
                <div
                  key={s.step}
                  className="bg-[#F8FAFC] border border-border rounded-2xl p-5 flex flex-col justify-between relative group hover:border-primary/40 hover:shadow-card transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-extrabold text-primary/40 group-hover:text-primary transition-colors">
                        {s.step}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-accent">
                        <StepIcon className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-accent mb-1">
                      {s.title}
                    </h4>
                    <p className="text-xs text-accent-subtle leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Supported Analysis Metrics */}
        <div>
          <h3 className="text-xl font-bold text-accent tracking-tight mb-6">
            Supported Analysis Engines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysisTypes.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.title} className="bg-[#F8FAFC] border border-border rounded-2xl p-6 flex items-start gap-4">
                  <div className={`p-3 rounded-xl border ${item.color} shrink-0`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-accent">{item.title}</h4>
                    <p className="text-xs text-accent-subtle mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Resilience Section */}
        <div>
          <h3 className="text-xl font-bold text-accent tracking-tight mb-6">
            Error Protection & Resilience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {errorHandlingCases.map((err) => {
              const ErrIcon = err.icon;
              return (
                <div key={err.title} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                      <ErrIcon className="w-4 h-4" />
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 text-slate-700 rounded font-mono">
                      {err.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-accent">{err.title}</h4>
                  <p className="text-xs text-accent-subtle leading-relaxed">{err.msg}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
