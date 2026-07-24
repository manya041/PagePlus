import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Dashboard } from './components/Dashboard';
import { ErrorView } from './components/ErrorView';
import { FeaturesSection } from './components/FeaturesSection';
import { ApiSection } from './components/ApiSection';
import { DocsSection } from './components/DocsSection';
import { Footer } from './components/Footer';
import { AuditResult, ApiError, AnalysisStep } from './types';

export const App: React.FC = () => {
  const [step, setStep] = useState<AnalysisStep>('idle');
  const [targetUrl, setTargetUrl] = useState('');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocusInput = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  const handleReset = () => {
    setStep('idle');
    setAuditResult(null);
    setApiError(null);
    setTargetUrl('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyze = async (url: string) => {
    setTargetUrl(url);
    setAuditResult(null);
    setApiError(null);
    setStep('fetching');

    try {
      // Step 1: Fetching page (Simulated smooth step progression)
      const fetchTimer = new Promise((resolve) => setTimeout(resolve, 800));

      // Execute API request
      const apiCall = axios.post<AuditResult>('/api/analyze', { url }, {
        headers: { 'Content-Type': 'application/json' }
      });

      await fetchTimer;
      setStep('parsing');

      const parseTimer = new Promise((resolve) => setTimeout(resolve, 800));
      const response = await apiCall;
      await parseTimer;

      setStep('generating');
      await new Promise((resolve) => setTimeout(resolve, 600));

      setAuditResult(response.data);
      setStep('complete');

      // Smooth scroll down to dashboard
      setTimeout(() => {
        const dashElement = document.getElementById('dashboard-results');
        if (dashElement) {
          dashElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

    } catch (err: any) {
      setStep('error');
      if (err.response && err.response.data) {
        setApiError(err.response.data as ApiError);
      } else if (err.code === 'ERR_NETWORK') {
        setApiError({
          error: 'API Server Offline',
          code: 'NETWORK_ERROR',
          message: 'Could not connect to the PagePulse API backend server. Please check if the server is running on port 5000.'
        });
      } else {
        setApiError({
          error: 'Audit Failed',
          code: 'SERVER_ERROR',
          message: err.message || 'An unexpected error occurred during website analysis.'
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* Sticky Navbar */}
      <Navbar onReset={handleReset} onFocusInput={handleFocusInput} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onAnalyze={handleAnalyze} isLoading={step === 'fetching' || step === 'parsing' || step === 'generating'} inputRef={inputRef} />

        {/* Loading Overlay */}
        {(step === 'fetching' || step === 'parsing' || step === 'generating') && (
          <LoadingOverlay step={step} targetUrl={targetUrl} />
        )}

        {/* Error View */}
        {step === 'error' && apiError && (
          <ErrorView
            error={apiError}
            onRetry={() => handleAnalyze(targetUrl)}
            onBack={handleReset}
          />
        )}

        {/* Audit Results Dashboard */}
        {step === 'complete' && auditResult && (
          <div id="dashboard-results">
            <Dashboard result={auditResult} onReAudit={() => handleAnalyze(auditResult.url)} />
          </div>
        )}

        {/* Features, API Documentation & Engine Docs Sections */}
        <FeaturesSection />
        <ApiSection />
        <DocsSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
