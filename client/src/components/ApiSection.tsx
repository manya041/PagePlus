import React, { useState } from 'react';
import { Copy, Check, Code2, Server, Terminal, Sparkles } from 'lucide-react';

export const ApiSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const curlCode = `curl -X POST https://pagepulse-api.render.com/api/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://openai.com"}'`;

  const jsonResponse = `{
  "status": 200,
  "statusText": "OK",
  "responseTime": 184,
  "title": "OpenAI",
  "metaDescription": "Transforming work and creativity with AI...",
  "h1Count": 1,
  "missingAltImages": 2,
  "wordCount": 1438,
  "timestamp": "2026-07-24T15:00:00.000Z"
}`;

  const fieldsExplanation = [
    { field: 'status', type: 'number', desc: 'HTTP response status code returned by origin server (e.g. 200, 404, 500).' },
    { field: 'responseTime', type: 'number (ms)', desc: 'Time taken in milliseconds to fetch initial HTML document payload.' },
    { field: 'title', type: 'string | null', desc: 'Extracted contents of page <title> tag for SEO auditing.' },
    { field: 'metaDescription', type: 'string | null', desc: 'Extracted text content from meta description tag.' },
    { field: 'h1Count', type: 'number', desc: 'Count of top-level <h1> heading elements present in document.' },
    { field: 'missingAltImages', type: 'number', desc: 'Total count of <img> elements missing non-empty alt text.' },
    { field: 'wordCount', type: 'number', desc: 'Approximate count of visible body text words after removing tags.' }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(curlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="api-docs" className="py-16 md:py-24 bg-[#F8FAFC] border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Documentation Copy & Field Explanations */}
          <div className="space-y-6">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
              Developer REST API
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-accent tracking-tight">
              Programmatically audit any website
            </h2>

            <p className="text-accent-subtle text-base leading-relaxed">
              Integrate real-time website audits into your deployment pipelines, monitoring systems, or custom dashboards.
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Response Field Schema</h4>
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-2">
                {fieldsExplanation.map((f) => (
                  <div key={f.field} className="p-3 bg-white rounded-xl border border-border flex items-start gap-3">
                    <code className="text-xs font-mono font-bold text-primary shrink-0 bg-primary/5 px-2 py-0.5 rounded">
                      {f.field}
                    </code>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block mb-0.5">{f.type}</span>
                      <p className="text-xs text-accent-subtle leading-snug">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Code Snippet Terminal */}
          <div className="bg-[#0F172A] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 text-slate-200">
            {/* Terminal Top Bar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">POST /api/analyze</span>
              </div>
              <button
                onClick={handleCopy}
                className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>

            {/* Terminal Body */}
            <div className="p-4 space-y-4 font-mono text-xs overflow-x-auto">
              <div>
                <p className="text-slate-400 font-sans text-[11px] mb-1.5 uppercase tracking-wider font-semibold">Request Payload Example</p>
                <pre className="text-emerald-400 bg-slate-950 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
                  {curlCode}
                </pre>
              </div>

              <div>
                <p className="text-slate-400 font-sans text-[11px] mb-1.5 uppercase tracking-wider font-semibold">Response Payload (200 OK)</p>
                <pre className="text-blue-300 bg-slate-950 p-3 rounded-lg leading-relaxed max-h-64 overflow-y-auto">
                  {jsonResponse}
                </pre>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
