import React, { useEffect, useState } from 'react';
import { Activity, Github, ArrowRight, BookOpen, Code, Sparkles } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  onFocusInput: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, onFocusInput }) => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'api-docs', 'docs'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-border transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={onReset}
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:bg-primary-hover transition-colors">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="font-bold text-lg tracking-tight text-accent flex items-center gap-1.5">
              PagePulse
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary rounded-full uppercase tracking-wider">
                Pro
              </span>
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button 
            onClick={() => scrollToSection('features')}
            className={`transition-colors flex items-center gap-1.5 ${
              activeSection === 'features' ? 'text-primary font-bold' : 'text-accent-subtle hover:text-accent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            Features
          </button>
          <button 
            onClick={() => scrollToSection('api-docs')}
            className={`transition-colors flex items-center gap-1.5 ${
              activeSection === 'api-docs' ? 'text-primary font-bold' : 'text-accent-subtle hover:text-accent'
            }`}
          >
            <Code className="w-4 h-4" />
            API
          </button>
          <button 
            onClick={() => scrollToSection('docs')}
            className={`transition-colors flex items-center gap-1.5 ${
              activeSection === 'docs' ? 'text-primary font-bold' : 'text-accent-subtle hover:text-accent'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Docs
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-subtle hover:text-accent transition-colors flex items-center gap-1.5"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </nav>

        {/* CTA Analyze Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onFocusInput}
            className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover active:scale-[0.98] rounded-xl shadow-sm transition-all duration-150 flex items-center gap-2"
          >
            <span>Analyze Webpage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
