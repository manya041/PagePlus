import React from 'react';
import { SearchCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-border py-12 text-sm text-accent-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          
          {/* Brand Logo & Description */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <SearchCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-accent tracking-tight text-base">PagePulse</span>
              <p className="text-xs text-primary font-semibold uppercase tracking-wider">SEO Inspector Platform</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-accent-subtle">
            <a href="#features" className="hover:text-accent transition-colors">Features</a>
            <a href="#api-docs" className="hover:text-accent transition-colors">API Docs</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
            <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Digital Heroes</a>
          </div>

        </div>

        {/* Digital Heroes Mandatory Badge Footer Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} PagePulse SaaS. Commercial Audit Engine.</p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8FAFC] border border-border text-accent">
            <span>Built for</span>
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary hover:underline flex items-center gap-1"
            >
              Digital Heroes Training Task
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
