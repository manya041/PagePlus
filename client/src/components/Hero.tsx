import React, { useState } from 'react';
import { Search, Globe, ArrowRight, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyze, isLoading, inputRef }) => {
  const [urlInput, setUrlInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmed = urlInput.trim();
    if (!trimmed) {
      setValidationError('Please enter a website URL to analyze.');
      return;
    }

    onAnalyze(trimmed);
  };

  const handleQuickSelect = (exampleUrl: string) => {
    setUrlInput(exampleUrl);
    setValidationError(null);
    onAnalyze(exampleUrl);
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Top Product Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-border text-xs font-semibold text-accent-subtle shadow-sm mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Next-Gen Web Auditor Engine v1.0</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-accent tracking-tight leading-[1.15]"
        >
          Analyze any website <br className="hidden sm:inline" />
          <span className="text-primary">in seconds</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-accent-subtle max-w-2xl mx-auto leading-relaxed"
        >
          Instantly inspect response time, metadata, accessibility and page structure from a single dashboard.
        </motion.p>

        {/* Main URL Search Bar Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="relative group">
            <div className="relative flex items-center bg-white rounded-2xl border border-border shadow-card hover:shadow-card-hover focus-within:shadow-input-focus focus-within:border-primary transition-all duration-200 p-2">
              
              <div className="pl-3.5 pr-2 text-accent-subtle flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="https://example.com"
                disabled={isLoading}
                className="w-full bg-transparent py-3 px-2 text-base text-accent placeholder-slate-400 focus:outline-none disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3.5 bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-sm transition-all duration-150 flex items-center gap-2 shrink-0 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Auditing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {validationError && (
              <p className="mt-2.5 text-sm font-medium text-danger text-left pl-4">
                {validationError}
              </p>
            )}
          </form>

          {/* Quick Examples */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-accent-subtle">
            <span>Try auditing:</span>
            <button
              type="button"
              onClick={() => handleQuickSelect('https://apple.com')}
              className="px-2.5 py-1 rounded-md bg-white border border-border hover:border-primary hover:text-primary transition-colors font-mono"
            >
              apple.com
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('https://stripe.com')}
              className="px-2.5 py-1 rounded-md bg-white border border-border hover:border-primary hover:text-primary transition-colors font-mono"
            >
              stripe.com
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('https://vercel.com')}
              className="px-2.5 py-1 rounded-md bg-white border border-border hover:border-primary hover:text-primary transition-colors font-mono font-medium"
            >
              vercel.com
            </button>
          </div>
        </motion.div>

        {/* Trusted By Developers Worldwide (Decorative SaaS Trust Bar) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-10 border-t border-border/60"
        >
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-6">
            Trusted by developers & SEO teams worldwide
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <div className="flex items-center gap-2 text-slate-700 font-extrabold text-lg tracking-tight">
              <Zap className="w-5 h-5 text-primary" />
              <span>Vercel</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-extrabold text-lg tracking-tight">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>Stripe</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-extrabold text-lg tracking-tight">
              <Layers className="w-5 h-5 text-primary" />
              <span>Supabase</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-extrabold text-lg tracking-tight">
              <Search className="w-5 h-5 text-primary" />
              <span>Linear</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-extrabold text-lg tracking-tight">
              <Globe className="w-5 h-5 text-primary" />
              <span>Raycast</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
