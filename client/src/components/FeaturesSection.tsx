import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Search, ShieldCheck, FileText, Activity, Code, ArrowRight } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Response Time & Latency',
      desc: 'Accurately measures TTFB and total HTTP document request latency with color-coded speed benchmarks.',
    },
    {
      icon: Search,
      title: 'SEO Metadata Analysis',
      desc: 'Inspects HTML <title> tags and meta descriptions against search engine length recommendations.',
    },
    {
      icon: ShieldCheck,
      title: 'Accessibility Audits',
      desc: 'Scans image tags across the document body to identify missing alt attributes and compliance gaps.',
    },
    {
      icon: FileText,
      title: 'Content Structure & Words',
      desc: 'Extracts visible text word density, calculates estimated reading duration, and evaluates content depth.',
    },
    {
      icon: Activity,
      title: 'HTTP Status & Headers',
      desc: 'Detects HTTP status codes (200 OK, 301 Redirects, 404 Not Found) and header response profiles.',
    },
    {
      icon: Code,
      title: 'Developer Friendly API',
      desc: 'Programmatically trigger website audits from your application using our clean JSON REST API.',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 border-t border-border/60 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
            Engine Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-accent tracking-tight">
            Everything you need to inspect page health
          </h2>
          <p className="text-accent-subtle text-base sm:text-lg">
            PagePulse combines site latency, structural SEO, accessibility, and content metrics into a unified, high-performance report.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-[#F8FAFC] border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-card-hover transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-border group-hover:bg-primary group-hover:text-white group-hover:border-primary flex items-center justify-center text-primary shadow-sm transition-all duration-200 mb-5">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-accent tracking-tight mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-accent-subtle leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
